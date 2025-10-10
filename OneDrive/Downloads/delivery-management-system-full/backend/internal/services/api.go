package services

import (
	"context"
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"

	"dms/config"
	"dms/internal/middleware"
	"dms/internal/models"
	"dms/internal/repository"

	"github.com/go-chi/chi/v5"
	"github.com/redis/go-redis/v9"
)

type API struct {
	DB    *sql.DB
	Redis *redis.Client
	Cfg   *config.Config
	Auth  *AuthService
}

func NewAPI(db *sql.DB, rdb *redis.Client, cfg *config.Config, auth *AuthService) *API {
	return &API{DB: db, Redis: rdb, Cfg: cfg, Auth: auth}
}

func (a *API) RegisterRoutes(r *chi.Mux) {
	ur := repository.NewUserRepo(a.DB)
	or := repository.NewOrderRepo(a.DB)
	_ = ur.EnsureTables(context.Background())
	_ = or.EnsureTables(context.Background())
	redisSrv := NewRedisService(a.Redis)
	pub := &RedisPub{Publish: func(ctx context.Context, o *models.Order) error { return redisSrv.PublishOrderUpdate(ctx, o) }}
	orderSvc := NewOrderService(or, pub)
	authSvc := a.Auth

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) { w.Write([]byte("ok")) })

	r.Post("/register", func(w http.ResponseWriter, r *http.Request) {
		var dto UserDTO
		_ = json.NewDecoder(r.Body).Decode(&dto)
		if dto.Role == "" {
			dto.Role = "customer"
		}
		if err := authSvc.Register(r.Context(), &dto); err != nil {
			http.Error(w, "failed", 500)
			return
		}
		w.WriteHeader(201)
		json.NewEncoder(w).Encode(map[string]string{"email": dto.Email})
	})

	r.Post("/login", func(w http.ResponseWriter, r *http.Request) {
		var b struct{ Email, Password string }
		_ = json.NewDecoder(r.Body).Decode(&b)
		t, err := authSvc.Login(r.Context(), b.Email, b.Password)
		if err != nil {
			http.Error(w, "unauthorized", 401)
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"token": t})
	})

	protected := chi.NewRouter()
	protected.Use(func(next http.Handler) http.Handler { return middleware.JWTAuth(a.Cfg, next) })

	protected.Post("/orders", func(w http.ResponseWriter, r *http.Request) {
		var o models.Order
		_ = json.NewDecoder(r.Body).Decode(&o)
		if o.CustomerID == 0 {
			if v := r.Context().Value(middleware.UserContextKey); v != nil {
				ti := v.(*middleware.TokenInfo)
				o.CustomerID = ti.UserID
			}
		}
		if err := orderSvc.CreateOrder(r.Context(), &o); err != nil {
			http.Error(w, "failed", 500)
			return
		}
		w.WriteHeader(201)
		json.NewEncoder(w).Encode(o)
	})

	protected.Get("/orders/{id}", func(w http.ResponseWriter, r *http.Request) {
		idS := chi.URLParam(r, "id")
		id, _ := strconv.Atoi(idS)
		o, err := or.GetByID(r.Context(), id)
		if err != nil {
			http.Error(w, "not found", 404)
			return
		}
		if v := r.Context().Value(middleware.UserContextKey); v != nil {
			ti := v.(*middleware.TokenInfo)
			if ti.Role == "customer" && ti.UserID != o.CustomerID {
				http.Error(w, "forbidden", 403)
				return
			}
		}
		json.NewEncoder(w).Encode(o)
	})

	protected.Post("/orders/{id}/cancel", func(w http.ResponseWriter, r *http.Request) {

		idS := chi.URLParam(r, "id")
		id, _ := strconv.Atoi(idS)
		o, err := or.GetByID(r.Context(), id)
		if err != nil {
			http.Error(w, "not found", 404)
			return
		}
		if v := r.Context().Value(middleware.UserContextKey); v != nil {
			ti := v.(*middleware.TokenInfo)
			if ti.Role == "customer" && ti.UserID != o.CustomerID {
				http.Error(w, "forbidden", 403)
				return
			}
		}
		if err := orderSvc.CancelOrder(r.Context(), id); err != nil {
			http.Error(w, "failed", 500)
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"status": "cancelled"})
	})

	r.Mount("/", protected)
}
