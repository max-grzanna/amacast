dump-db:
	docker-compose exec db bash -c "PGPASSWORD=pass pg_dump -U user amacast" > ../dumps/amacast_dump.sql

down:
	docker-compose down -v

stop:
	docker-compose stop

up:
	docker-compose up -d --build

restart: down up

reload: down up
