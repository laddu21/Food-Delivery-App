package repository

import (
	"context"
	"database/sql"
	"dms/internal/models"
	"errors"
	"fmt"
)

type UserRepo struct{ DB *sql.DB }

func NewUserRepo(db *sql.DB) *UserRepo { return &UserRepo{DB: db} }
func (r *UserRepo) Create(ctx context.Context, u *models.User) error {
	q := `INSERT INTO users (name,email,password,role) VALUES ($1,$2,$3,$4) RETURNING id`
	return r.DB.QueryRowContext(ctx, q, u.Name, u.Email, u.Password, u.Role).Scan(&u.ID)
}
func (r *UserRepo) GetByEmail(ctx context.Context, email string) (*models.User, error) {
	u := &models.User{}
	q := `SELECT id,name,email,password,role FROM users WHERE email=$1`
	row := r.DB.QueryRowContext(ctx, q, email)
	if err := row.Scan(&u.ID, &u.Name, &u.Email, &u.Password, &u.Role); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return u, nil
}
func (r *UserRepo) EnsureTables(ctx context.Context) error {
	st := `CREATE TABLE IF NOT EXISTS users (id serial PRIMARY KEY, name text, email text UNIQUE, password text, role text);`
	_, err := r.DB.ExecContext(ctx, st)
	if err != nil {
		return fmt.Errorf("create users: %w", err)
	}
	return nil
}
