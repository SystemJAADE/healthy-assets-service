docker-dev-run:
	docker compose -f docker-compose.dev.yml up api minio

docker-dev-run-bg:
	docker compose -f docker-compose.dev.yml up -d api minio

docker-dev-stop:
	docker compose -f docker-compose.dev.yml down

docker-dev-logs:
	docker compose -f docker-compose.dev.yml logs

docker-prod-run:
	docker compose -f docker-compose.prod.yml up api minio

docker-prod-run-bg:
	docker compose -f docker-compose.prod.yml up -d api minio

docker-prod-stop:
	docker compose -f docker-compose.prod.yml down

docker-prod-logs:
	docker compose -f docker-compose.dev.yml logs