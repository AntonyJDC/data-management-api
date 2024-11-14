# Data Management API

Este repositorio contiene el código fuente de la Data Management API, diseñada para realizar operaciones CRUD en un entorno basado en microservicios. La API está construida con TypeScript y Docker, facilitando el despliegue y la escalabilidad de la aplicación.

## Tabla de Contenidos
1. [Requerimientos](#requerimientos)
2. [Instalación](#instalación)
3. [Configuración de la Base de Datos](#configuración-de-la-base-de-datos)
4. [Ejecución del Proyecto](#ejecución-del-proyecto)
6. [Scripts Disponibles](#scripts-disponibles)
7. [Dependencias Principales](#dependencias-principales)

## Requerimientos
- Docker
- Docker Compose
- MongoDB (puede configurarse mediante un contenedor en Docker)

## Instalación
Nota: Asegúrate de que Docker Desktop esté instalado y en ejecución.
1. Clona este repositorio:
```bash
git clone https://github.com/AntonyJDC/data-management-api.git
```

2. Navega al directorio del proyecto:
```bash
cd data-management-api
```

3. Construye e inicia los contenedores:
```bash
docker-compose up --build
```

### Detalles del contenedor

El archivo `docker-compose.yml` configura el siguiente servicio:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    environment:
      MONGO_INITDB_DATABASE: datamanagement
    ports:
      - "27017:27017"
    volumes:  
      - mongo-data:/data/db

  read-service:
    build: ./read-service
    ports:
      - "3003:3003"
    environment:
      - DB_HOST=mongodb
      - DB_PORT=27017
      - DB_NAME=datamanagement
    depends_on:
      - mongodb
    volumes:
      - ./read-service:/app
      - /app/node_modules

  create-service:
    build: ./create-service
    ports:
      - "3001:3001"
    environment:
      - DB_HOST=mongodb
      - DB_PORT=27017
      - DB_NAME=datamanagement
    depends_on:
      - mongodb
    volumes:
      - ./create-service:/app
      - /app/node_modules

  delete-service:
    build: ./delete-service
    ports:
      - "3002:3002"
    environment:
      - DB_HOST=mongodb
      - DB_PORT=27017
      - DB_NAME=datamanagement
    depends_on:
      - mongodb
    volumes:
      - ./delete-service:/app
      - /app/node_modules

  update-service:
    build: ./update-service
    ports:
      - "3004:3004"
    environment:
      - DB_HOST=mongodb
      - DB_PORT=27017
      - DB_NAME=datamanagement
    depends_on:
      - mongodb
    volumes:
      - ./update-service:/app
      - /app/node_modules

volumes:
  mongo-data:
```

## Configuración de la Base de Datos
Para conectarte a esta instancia de MongoDB desde tu aplicación, usa la siguiente URL de conexión:

```bash
mongodb://localhost:27017
```
Asegúrate de que esta URL coincida con la configuración en tu archivo `.env`.

## Ejecución del Proyecto
Para iniciar el proyecto en modo de desarrollo, utiliza Docker:
```bash
docker-compose up
```

## Scripts Disponibles
- `docker-compose up --build`: Inicia el proyecto y construye los contenedores.
- `docker-compose down`: Detiene y elimina los contenedores activos.

## Dependencias Principales
- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Docker](https://www.docker.com/)
- [MongoDB](https://www.mongodb.com/)


