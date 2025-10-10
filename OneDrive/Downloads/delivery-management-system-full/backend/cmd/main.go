package main

import (
	"context"
	"database/sql"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"dms/config"
	"dms/internal/repository"
	"dms/internal/services"

	"github.com/go-chi/chi/v5"
)

func main() {
	cfg := config.Load()
	db := config.InitPostgres(cfg)
	// wait for DB to be ready (avoid race during docker-compose startup)
	if err := waitForDB(db, 30*time.Second); err != nil {
		log.Fatalf("database not ready: %v", err)
	}
	redisClient := config.InitRedis(cfg)

	userRepo := repository.NewUserRepo(db)
	authSvc := services.NewAuthService(userRepo, cfg.JWTSecret, db)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	adminEmail := "admin@example.com"
	existing, _ := userRepo.GetByEmail(ctx, adminEmail)
	if existing == nil {
		admin := &services.UserDTO{Name: "admin", Email: adminEmail, Password: "adminpass", Role: "admin"}
		_ = authSvc.Register(ctx, admin)
		log.Println("seeded admin user:", adminEmail)
	}

	router := chi.NewRouter()
	// basic readiness/liveness endpoint
	router.Get("/healthz", func(w http.ResponseWriter, r *http.Request) {
		if err := db.Ping(); err != nil {
			http.Error(w, "db not ready", 500)
			return
		}
		if err := redisClient.Ping(r.Context()).Err(); err != nil {
			http.Error(w, "redis not ready", 500)
			return
		}
		w.WriteHeader(200)
		w.Write([]byte("ok"))
	})
	api := services.NewAPI(db, redisClient, cfg, authSvc)
	api.RegisterRoutes(router)

	srv := &http.Server{Addr: ":" + cfg.Port, Handler: router}

	go func() {
		log.Println("🚀 Server running on port", cfg.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen failed: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("shutting down...")
	ctx2, cancel2 := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel2()
	_ = srv.Shutdown(ctx2)
	log.Println("stopped")
}

func waitForDB(db *sql.DB, timeout time.Duration) error {
	deadline := time.Now().Add(timeout)
	var err error
	for time.Now().Before(deadline) {
		err = db.Ping()
		if err == nil {
			return nil
		}
		time.Sleep(500 * time.Millisecond)
	}
	return err
}
