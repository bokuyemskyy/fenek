# fenek

## Overview

A messaging platform built with **React** and **Java Spring Boot**, designed to support **encrypted chats**, **real-time communication**, and **federated authentication**.
Currently the project is on the stage of development and focuses on backend architecture. The frontend remains minimal.

## Features
- Integrated authentication with **Keycloak (OpenID Connect)** which supports local credentials and Google OAuth.
* Microservice-based architecture, each component should be separated for modularity.
* Planned **WebSocket** support for real-time encrypted chat.
* Dockerized dev-containers and docker compose for reproducible environment.
* Security-oriented design

## Technical stack

### Core technologies

* Backend: Java 25, Spring Boot, Spring Security, Keycloak
* Frontend: React
* Database: PostgreSQL
* Communication: REST APIs, WebSockets, planned Kafka
* Containerization: Docker, Docker Compose

### Infrastructure and tooling

* Authentication: Keycloak OpenID Connect
* Build: Gradle 9.1.0
* CI/CD: planned GitHub Actions
* Gateway: custom NodeJS
