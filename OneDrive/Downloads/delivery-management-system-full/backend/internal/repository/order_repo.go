package repository

import (
	"context"
	"database/sql"
	"dms/internal/models"
	"fmt"
	"time"
)

type OrderRepo struct{ DB *sql.DB }

func NewOrderRepo(db *sql.DB) *OrderRepo { return &OrderRepo{DB: db} }
func (r *OrderRepo) Create(ctx context.Context, o *models.Order) error {
	q := `INSERT INTO orders (customer_id,item,status,created_at,updated_at) VALUES ($1,$2,$3,$4,$5) RETURNING id`
	return r.DB.QueryRowContext(ctx, q, o.CustomerID, o.Item, o.Status, o.CreatedAt, o.UpdatedAt).Scan(&o.ID)
}
func (r *OrderRepo) UpdateStatus(ctx context.Context, orderID int, status models.OrderStatus) error {
	q := `UPDATE orders SET status=$1, updated_at=$2 WHERE id=$3`
	_, err := r.DB.ExecContext(ctx, q, status, time.Now(), orderID)
	return err
}
func (r *OrderRepo) GetByID(ctx context.Context, id int) (*models.Order, error) {
	o := &models.Order{}
	q := `SELECT id,customer_id,item,status,created_at,updated_at FROM orders WHERE id=$1`
	if err := r.DB.QueryRowContext(ctx, q, id).Scan(&o.ID, &o.CustomerID, &o.Item, &o.Status, &o.CreatedAt, &o.UpdatedAt); err != nil {
		return nil, err
	}
	return o, nil
}
func (r *OrderRepo) EnsureTables(ctx context.Context) error {
	st := `CREATE TABLE IF NOT EXISTS orders (id serial PRIMARY KEY, customer_id int REFERENCES users(id), item text, status text, created_at timestamp, updated_at timestamp);`
	_, err := r.DB.ExecContext(ctx, st)
	if err != nil {
		return fmt.Errorf("create orders: %w", err)
	}
	return nil
}
