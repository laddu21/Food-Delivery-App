package repository

import (
    "context"
    "database/sql"
    "fmt"
    "testing"
    "time"

    _ "github.com/jackc/pgx/v5/stdlib"
    "github.com/ory/dockertest/v3"
    "github.com/ory/dockertest/v3/docker"

    "dms/internal/models"
)

// TestUserRepo_CreateGet spins up a temporary Postgres container and verifies
// that EnsureTables, Create and GetByEmail work as expected.
func TestUserRepo_CreateGet(t *testing.T) {
    pool, err := dockertest.NewPool("")
    if err != nil {
        t.Fatalf("could not connect to docker: %v", err)
    }

    options := &dockertest.RunOptions{
        Repository: "postgres",
        Tag:        "15",
        Env: []string{
            "POSTGRES_USER=admin",
            "POSTGRES_PASSWORD=admin",
            "POSTGRES_DB=delivery_db",
        },
    }

    resource, err := pool.RunWithOptions(options, func(hc *docker.HostConfig) {
        hc.AutoRemove = true
        hc.RestartPolicy = docker.RestartPolicy{Name: "no"}
    })
    if err != nil {
        t.Fatalf("could not start resource: %v", err)
    }

    // Ensure container is purged at the end
    t.Cleanup(func() {
        // allow some time for proper shutdown
        time.Sleep(200 * time.Millisecond)
        _ = pool.Purge(resource)
    })

    var db *sql.DB
    // Retry until Postgres is ready
    if err := pool.Retry(func() error {
        var derr error
        port := resource.GetPort("5432/tcp")
        dsn := fmt.Sprintf("postgres://admin:admin@localhost:%s/delivery_db?sslmode=disable", port)
        db, derr = sql.Open("pgx", dsn)
        if derr != nil {
            return derr
        }
        return db.Ping()
    }); err != nil {
        t.Fatalf("could not connect to database: %v", err)
    }

    // Close DB when done
    t.Cleanup(func() { _ = db.Close() })

    ctx := context.Background()
    repo := NewUserRepo(db)

    if err := repo.EnsureTables(ctx); err != nil {
        t.Fatalf("EnsureTables failed: %v", err)
    }

    u := &models.User{Name: "Test User", Email: "test@example.com", Password: "secret", Role: "customer"}
    if err := repo.Create(ctx, u); err != nil {
        t.Fatalf("Create failed: %v", err)
    }
    if u.ID == 0 {
        t.Fatalf("expected ID to be assigned")
    }

    got, err := repo.GetByEmail(ctx, u.Email)
    if err != nil {
        t.Fatalf("GetByEmail error: %v", err)
    }
    if got == nil {
        t.Fatalf("expected user returned, got nil")
    }
    if got.Email != u.Email || got.Name != u.Name || got.Role != u.Role {
        t.Fatalf("user mismatch: got %+v want %+v", got, u)
    }
}
