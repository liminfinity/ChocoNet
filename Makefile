IMAGE_NAME := choconet-backend:latest
PGDATA_DIR := db-data

DOCKER_COMPOSE := docker compose

.PHONY: up rm rm-with-volumes up-db rm-db rm-backend status

up:
	$(DOCKER_COMPOSE) up --detach --force-recreate

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

up-db:
	$(DOCKER_COMPOSE) up -d db

rm-db:
	$(DOCKER_COMPOSE) stop db
	$(DOCKER_COMPOSE) rm -f db
	@if [ -d "$(PGDATA_DIR)" ]; then sudo rm -rf $(PGDATA_DIR); fi

rm-backend:
	$(DOCKER_COMPOSE) stop backend
	$(DOCKER_COMPOSE) rm -f backend
	docker image rm $(IMAGE_NAME) || true
	@if [ -d "$(PGDATA_DIR)" ]; then sudo rm -rf $(PGDATA_DIR); fi

status:
	$(DOCKER_COMPOSE) ps
