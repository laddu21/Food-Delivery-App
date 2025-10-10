package services

import (
	"context"
	"dms/internal/models"
	"fmt"

	"github.com/redis/go-redis/v9"
)

type RedisService struct{ Client *redis.Client }

func NewRedisService(c *redis.Client) *RedisService { return &RedisService{Client: c} }
func (r *RedisService) PublishOrderUpdate(ctx context.Context, o *models.Order) error {
	msg := fmt.Sprintf("{\"order_id\":%d,\"status\":\"%s\"}", o.ID, o.Status)
	return r.Client.Publish(ctx, "order_updates", msg).Err()
}
