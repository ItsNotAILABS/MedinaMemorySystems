FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod ./
RUN go mod download 2>/dev/null || true
COPY cmd/ ./cmd/
RUN CGO_ENABLED=0 go build -o xcrew-edge ./cmd/xcrew-edge

FROM alpine:3.19
RUN apk add --no-cache ca-certificates curl
COPY --from=builder /app/xcrew-edge /usr/local/bin/
EXPOSE 9001
CMD ["xcrew-edge"]
