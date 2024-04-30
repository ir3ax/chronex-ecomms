.PHONY: all build deps dev-deps image migrate test vet sec format unused
CHECK_FILES?=./...
FLAGS?=-ldflags "-X github.com/supabase/gotrue/internal/utilities.Version=`git describe --tags`" -buildvcs=false
DEV_DOCKER_COMPOSE:=docker-compose-dev.yml

help: ## Show this help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {sub("\\\\n",sprintf("\n%22c"," "), $$2);printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

proto: ## Generate protobuf files
	protoc pkg/pb/chronexdata.proto --go_out=. --go_opt=paths=source_relative --go-grpc_out=. --go-grpc_opt=paths=source_relative

server: ## Run the server
	go run main.go

migrate: ## Run the migrations
	cd schema && for file in *.sql; do \
		PGPASSWORD=root psql -U postgres -a -d postgres -f "$$file"; \
	done


migrate-test: ## Run the migrations
	cd schema && for file in *.sql; do \
		PGPASSWORD=psAFEW2023! psql -U admin -a -d postgresdb -f "$$file"; \
	done