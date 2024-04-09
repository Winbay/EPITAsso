# EPITAssoAPI

REST API developed in Python 3.12 and Django 5.0

## Launch REST API and PostgreSQL Database with Docker (development environment)

### Prerequisites
- Docker

```sh
docker-compose -f docker-compose.dev.yml build 
docker-compose -f docker-compose.dev.yml up
```

This configuration supports live reloading.

You can use given .env.dev file or modify it.

