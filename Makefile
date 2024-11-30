IMAGE_NAME := choconet-backend:latest
PGDATA_DIR := db-data
REDIS_DATA_DIR := redis-data

DOCKER_COMPOSE := docker compose

.PHONY: up rm rm-with-volumes up-db rm-db rm-backend status

up:
	$(DOCKER_COMPOSE) up --detach --force-recreate

up-with-logs:
	$(DOCKER_COMPOSE) up --force-recreate

rm:
	$(DOCKER_COMPOSE) stop
	$(DOCKER_COMPOSE) down --remove-orphans
	docker image rm $(IMAGE_NAME) || true
	@if [ -d "$(PGDATA_DIR)" ]; then sudo rm -rf $(PGDATA_DIR); fi

rm-with-volumes:
	$(DOCKER_COMPOSE) stop
	$(DOCKER_COMPOSE) down --remove-orphans --volumes
	docker image rm $(IMAGE_NAME) || true
	@if [ -d "$(PGDATA_DIR)" ]; then sudo rm -rf $(PGDATA_DIR); fi
	@if [ -d "$(REDIS_DATA_DIR)" ]; then sudo rm -rf $(REDIS_DATA_DIR); fi

up-db:
	$(DOCKER_COMPOSE) up -d db

rm-db:
	$(DOCKER_COMPOSE) stop db
	$(DOCKER_COMPOSE) rm -f db
	@if [ -d "$(PGDATA_DIR)" ]; then sudo rm -rf $(PGDATA_DIR); fi

up-redis:
	$(DOCKER_COMPOSE) up -d redis

rm-redis:
	$(DOCKER_COMPOSE) stop redis
	$(DOCKER_COMPOSE) rm -f redis
	@if [ -d "$(REDIS_DATA_DIR)" ]; then sudo rm -rf $(REDIS_DATA_DIR); fi

rm-backend:
	$(DOCKER_COMPOSE) stop backend
	$(DOCKER_COMPOSE) rm -f backend
	docker image rm $(IMAGE_NAME) || true
	@if [ -d "$(PGDATA_DIR)" ]; then sudo rm -rf $(PGDATA_DIR); fi

up-backend:
	$(DOCKER_COMPOSE) up -d backend

status:
	$(DOCKER_COMPOSE) ps
