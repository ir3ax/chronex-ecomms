FROM --platform=linux/amd64 golang:1.19 as builder

WORKDIR /app

COPY go.mod .
COPY go.sum .

RUN go mod download

COPY cmd /app/cmd
COPY pkg /app/pkg
COPY .env /app/env

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -installsuffix cgo -o /app/main ./cmd/main.go

# Path: Dockerfile
FROM --platform=linux/amd64 alpine:latest

WORKDIR /root/

COPY --from=builder /app/main .
COPY --from=builder /app/env .env
RUN chmod +x ./main

CMD ["./main"]