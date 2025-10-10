package services

import (
	"context"
	"dms/internal/models"
	"dms/internal/repository"
	"sync"
	"time"
)

type RedisPub struct {
	Publish func(ctx context.Context, o *models.Order) error
}
type OrderService struct {
	Repo  *repository.OrderRepo
	Redis *RedisPub
	mu    sync.Mutex
}

func NewOrderService(r *repository.OrderRepo, pub *RedisPub) *OrderService {
	return &OrderService{Repo: r, Redis: pub}
}
func (s *OrderService) CreateOrder(ctx context.Context, o *models.Order) error {
	o.Status = models.StatusCreated
	now := time.Now()
	o.CreatedAt = now
	o.UpdatedAt = now
	if err := s.Repo.Create(ctx, o); err != nil {
		return err
	}
	s.TrackOrder(ctx, o.ID)
	return nil
}
func (s *OrderService) TrackOrder(ctx context.Context, orderID int) {
	go func() {
		states := []models.OrderStatus{models.StatusDispatched, models.StatusInTransit, models.StatusDelivered}
		for _, st := range states {
			time.Sleep(3 * time.Second)
			s.mu.Lock()
			_ = s.Repo.UpdateStatus(ctx, orderID, st)
			o, _ := s.Repo.GetByID(ctx, orderID)
			if s.Redis != nil && o != nil {
				_ = s.Redis.Publish(ctx, o)
			}
			s.mu.Unlock()
		}
	}()
}
func (s *OrderService) CancelOrder(ctx context.Context, orderID int) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.Repo.UpdateStatus(ctx, orderID, models.StatusCancelled)
}
