Launch full-application by docker-compose. If docker-images not installed:
```shell
docker compose --env-file .app.env up 
```

Launch ready application like installed container:
```shell
docker start <container_name or id>
```

Make revision migrations:
```shell
alembic revision --autogenerate -m "<message>"
```

Apply tables migrations:
```shell
alembic upgrade head
```

Launch web-application-server from root dir:
```shell
python -m app.main 
```



