# EPITAsso

## Project Overview

This web platform centralizes all student associations in one place. Associations can communicate with each other, post announcements, lend equipment, and manage volunteer engagement.
For students, no more juggling between different communication tools — everything is now accessible through a single, unified website.

## Architecture

The project is divided into 4 parts:
- Backend: Django REST API (in ./backend/EPITAssoAPI/)
- Association Frontend: Vue.js (in ./frontend/panel_asso/)
- Student Frontend: Vue.js (in ./frontend/vitrine/)
- Administration Frontend: Vue.js (in ./frontend/panel_adm/)

## Installation

### Docker Compose Production Documentation

This documentation provides an overview of the Docker Compose file docker-compose.prod.yml used in this project.

#### Services
The Docker Compose file defines the following services:

##### db
This service uses the postgres:13-alpine image and sets up the database for the application. It uses a volume db_data for persisting database data.

##### django
This service builds the Django backend from the Dockerfile located at ./backend/Dockerfile.prod. It depends on the db service and exposes port 8000. Accessible at ``https://api.{DOMAIN_NAME}``.

##### asso
This service builds the association frontend from the Dockerfile located at ./frontend/asso/Dockerfile.prod.

##### etd
This service builds the student frontend from the Dockerfile located at ./frontend/etd/Dockerfile.prod.

##### adm
This service builds the admin panel frontend from the Dockerfile located at ./frontend/panel_adm/Dockerfile.prod.

##### nginx
This service builds the Nginx server from the Dockerfile located at ./nginx. It restarts always and exposes ports 80 and 443. It depends on the django, asso, etd, adm, and certbot services. It also mounts volumes for static files, certbot www directory, and certbot configuration directory. It routes requests to the appropriate services based on the domain name.
Services are located at:
- Django backend: https://api.{DOMAIN_NAME}
- Association frontend: https://association.{DOMAIN_NAME}
- Student frontend: https://etudiant.{DOMAIN_NAME}
- Administration frontend: https://administration.{DOMAIN_NAME}

##### certbot
This service uses the certbot/certbot:v2.10.0 image. It mounts volumes for the certbot www directory and certbot configuration directory. It runs the certonly command to generate certificates for the specified domains.

#### Volumes
The Docker Compose file defines the following volumes:

##### db_data
This volume is used for persisting database data.

##### static
This volume is used for storing static files.

#### Usage
To start all services, navigate to the directory containing the Docker Compose file and run:
```sh
docker-compose -f docker-compose.prod.yml up
```

To stop all services, use the following command:
```sh
docker-compose -f docker-compose.prod.yml down
```

Please replace {DOMAIN_NAME} in the certbot service command with your actual domain name.

#### Note
Ensure Docker and Docker Compose are installed on your machine and that you have the necessary permissions to execute Docker commands.

#### Nginx Configuration
In the nginx.conf file, replace all instances of localhost with your actual domain name. This is crucial for the correct routing of requests to your services.


### Docker Compose Development Documentation

The Docker Compose file for development testing is docker-compose.dev.yml.
It is the same as the production file, but with a few changes to the services.
All services are built from the Dockerfiles with .dev extension name located in the respective directories.
All services are not set to restart always, except PostgreSQL database.

#### Usage
To start all services, navigate to the directory containing the Docker Compose file and run:
```sh
docker-compose -f docker-compose.dev.yml up
```

To stop all services, use the following command:
```sh
docker-compose -f docker-compose.dev.yml down
```

All ports are exposed for development testing. You can access the services using the following URLs:
- PostgreSQL database: localhost:5432 (env file is in ./backend/EPITAssoAPI/.env.dev)
- Django backend: http://localhost:8000
- Association frontend: http://localhost:8081
- Student frontend: http://localhost:8082
- Administration frontend: http://localhost:8083

## Backend documentation

The backend is a Django REST API developed in Python 3.12 and Django 5.0.
The API documentation is available in [backend/EPITAssoAPI/README.md](./backend/EPITAssoAPI/README.md).
