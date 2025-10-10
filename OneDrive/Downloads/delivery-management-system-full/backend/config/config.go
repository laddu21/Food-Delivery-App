package config

import (
	"context"
	"fmt"
	"log"
	"os"

	"database/sql"

	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/joho/godotenv"
	"github.com/redis/go-redis/v9"
)

type Config struct {
	Port      string
	DbURL     string
	RedisURL  string
	JWTSecret string
}

func Load() *Config {
	_ = godotenv.Load()
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	dbUser := os.Getenv("POSTGRES_USER")
	if dbUser == "" {
		dbUser = "admin"
	}
	dbPass := os.Getenv("POSTGRES_PASSWORD")
	if dbPass == "" {
		dbPass = "password"
	}
	dbName := os.Getenv("POSTGRES_DB")
	if dbName == "" {
		dbName = "delivery_db"
	}
	dbHost := os.Getenv("POSTGRES_HOST")
	if dbHost == "" {
		dbHost = "postgres"
	}
	dbPort := os.Getenv("POSTGRES_PORT")
	if dbPort == "" {
		dbPort = "5432"
	}
	redisHost := os.Getenv("REDIS_HOST")
	if redisHost == "" {
		redisHost = "redis"
	}
	redisPort := os.Getenv("REDIS_PORT")
	if redisPort == "" {
		redisPort = "6379"
	}
	jwt := os.Getenv("JWT_SECRET")
	if jwt == "" {
		jwt = "supersecretjwt"
	}
	dbURL := fmt.Sprintf("postgres://%s:%s@%s:%s/%s", dbUser, dbPass, dbHost, dbPort, dbName)
	redisURL := fmt.Sprintf("%s:%s", redisHost, redisPort)
	return &Config{Port: port, DbURL: dbURL, RedisURL: redisURL, JWTSecret: jwt}
}

func InitPostgres(cfg *Config) *sql.DB {
	db, err := sql.Open("pgx", cfg.DbURL)
	if err != nil {
		log.Fatalf("pg open: %v", err)
	}
	if err := db.PingContext(context.Background()); err != nil {
		log.Printf("pg ping: %v", err)
	}
	return db
}

func InitRedis(cfg *Config) *redis.Client {
	opt := &redis.Options{Addr: cfg.RedisURL}
	rdb := redis.NewClient(opt)
	if err := rdb.Ping(context.Background()).Err(); err != nil {
		log.Printf("redis ping: %v", err)
	}
	return rdb
}
