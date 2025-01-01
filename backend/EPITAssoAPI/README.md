# EPITAssoAPI

REST API for EPIT'Asso website developed in Python 3.12 and Django 5.0

## Launch REST API and PostgreSQL Database

`⚠️ You need to have Docker installed.`

- ## [Development environment] Launch REST API and PostgreSQL Database

You need to have a `.env.dev` file which contains the following environment variables:
- POSTGRES_USER _(PostgreSQL User)_
- POSTGRES_PASSWORD _(PostgreSQL Password for the User)_
- POSTGRES_DB _(PostgreSQL Database name)_
- POSTGRES_HOST _(PostgreSQL hostname -> name of database service in docker-compose: `db`)_
- POSTGRES_PORT _(PostgreSQL port -> by default 5432)_
- SECRET_KEY _(Django Secret Key, you can generate on https://djecrety.ir/)_
- DEBUG _(set it to `True` or `False`, this environment variable set the DEBUG variable in `settings.py` of the Django project)_

After verified you have the environment file, you can run the following commands:
```sh
docker-compose -f docker-compose.yml build 
docker-compose -f docker-compose.yml up
```

This configuration supports live reloading.

The API is accessible on http://localhost:8000/

- ## [Production environment] Launch REST API and PostgreSQL Database

You need to have a `.env.prod` file which contains the following environment variables:
- POSTGRES_USER _(PostgreSQL User)_
- POSTGRES_PASSWORD _(PostgreSQL Password for the User)_
- POSTGRES_DB _(PostgreSQL Database name)_
- POSTGRES_HOST _(PostgreSQL hostname -> name of database service in docker-compose: `db`)_
- POSTGRES_PORT _(PostgreSQL port -> by default 5432)_
- SECRET_KEY _(Django Secret Key, you can generate on https://djecrety.ir/)_
- DEBUG _(set it to `False`, this environment variable set the DEBUG variable in `settings.py` of the Django project)_

After verified you have the environment file, you can run the following commands:
```sh
docker-compose -f docker-compose.prod.yml build 
docker-compose -f docker-compose.prod.yml up
```

The API is accessible on http://localhost/

## Documentation

The messaging app use websocket to send real-time messages.
The documentation of this service is available in [Websockets.md](./Websockets.md)