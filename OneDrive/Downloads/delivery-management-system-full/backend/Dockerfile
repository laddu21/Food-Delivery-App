FROM golang:1.21-alpine AS builder
WORKDIR /app

# install git so `go mod` can fetch modules hosted in git repositories
RUN apk add --no-cache git ca-certificates

# copy go.mod and go.sum first to leverage Docker layer caching for dependencies
COPY go.mod go.sum ./
RUN go mod download || true

# copy the rest of the source and build
COPY . .
RUN go mod download
RUN CGO_ENABLED=0 go build -ldflags "-s -w" -o /app/bin/dms ./cmd

FROM alpine:3.19
RUN apk add --no-cache ca-certificates
WORKDIR /app
COPY --from=builder /app/bin/dms /app/bin/dms
EXPOSE 8080
ENTRYPOINT ["/app/bin/dms"]
