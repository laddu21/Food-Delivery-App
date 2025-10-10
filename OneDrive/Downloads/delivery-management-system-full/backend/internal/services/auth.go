package services

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"dms/internal/models"
	"dms/internal/repository"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type UserDTO struct{ Name, Email, Password, Role string }
type AuthService struct {
	UserRepo *repository.UserRepo
	Secret   string
	DB       *sql.DB
}

func NewAuthService(ur *repository.UserRepo, secret string, db *sql.DB) *AuthService {
	return &AuthService{UserRepo: ur, Secret: secret, DB: db}
}
func (s *AuthService) Register(ctx context.Context, dto *UserDTO) error {
	_ = s.UserRepo.EnsureTables(ctx)
	u := &models.User{Name: dto.Name, Email: dto.Email, Role: dto.Role}
	hashed, err := bcrypt.GenerateFromPassword([]byte(dto.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.Password = string(hashed)
	return s.UserRepo.Create(ctx, u)
}
func (s *AuthService) Login(ctx context.Context, email, password string) (string, error) {
	u, err := s.UserRepo.GetByEmail(ctx, email)
	if err != nil || u == nil {
		return "", errors.New("invalid")
	}
	if err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password)); err != nil {
		return "", errors.New("invalid")
	}
	claims := jwt.MapClaims{"sub": u.ID, "role": u.Role, "exp": time.Now().Add(24 * time.Hour).Unix()}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.Secret))
}
