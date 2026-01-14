# fenek

## Overview

A microservices-based real-time messenger. Built to handle scaling asynchronous message delivery, and secure third-party authentication.

## Features

* **Microservices**: Decoupled backend services behind an NGINX API Gateway.
* **Real-time**: Instant messaging using STOMP over WebSockets.
* **Async**: Inter-service communication via RabbitMQ message broker.
* **Auth**: Secure login using Google and GitHub (OAuth2).
* **Storage**: S3-compatible media uploads using MinIO.

## Technical stack

### Core

* **Backend**: Java 21, Spring Boot 3, Spring Security.
* **Frontend**: React, TypeScript.
* **Communication**: REST API, WebSockets (STOMP), RabbitMQ.

### Infrastructure

* **Persistence**: PostgreSQL, Redis (caching).
* **Storage**: MinIO (S3).
* **Proxy**: NGINX.
* **Containerization**: Docker, Docker Compose.

## Usage

## Environment setup

Create a `./inftastructure/docker/.env` file:

```bash
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
RABBITMQ_USER=your_user
RABBITMQ_PASSWORD=your_password
MINIO_USER=your_user
MINIO_PASSWORD=your_password
GOOGLE_CLIENT_ID=your_google_auth_client_id
GOOGLE_CLIENT_SECRET=your_google_auth_client_secret
GITHUB_CLIENT_ID=your_github_auth_client_id
GITHUB_CLIENT_SECRET=your_github_auth_client_secret
JWT_SECRET_BASE_64=9p619sjdCSPmvDw785S1K3keqaAybG1erKaU7XXV8ws=
JWT_EXPIRATION_SECONDS=900
JWT_REFRESH_EXPIRATION_SECONDS=604800
```

### Run the project

Ensure you have Docker installed, then run from root directory:

```bash
docker compose -f ./infrastructure/docker/compose.yaml up --build
```
