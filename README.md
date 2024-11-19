# Data Management API

Este repositorio contiene el código fuente de la Data Management API, diseñada para realizar operaciones CRUD en un entorno basado en microservicios. La API está construida con TypeScript y Docker, facilitando el despliegue y la escalabilidad de la aplicación.

## Tabla de Contenidos
1. [Requerimientos](#requerimientos)
2. [Instalación](#instalación)
3. [Configuración de la Base de Datos](#configuración-de-la-base-de-datos)
4. [Ejecución del Proyecto](#ejecución-del-proyecto)
6. [Scripts Disponibles](#scripts-disponibles)
7. [Dependencias Principales](#dependencias-principales)
8. [Novedades](#novedades)

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
name: data-management
services:
  mongodb:
    image: mongo
    container_name: mongodb
    environment:
      MONGO_INITDB_DATABASE: datamanagement
    ports:
      - "27017:27017"
    volumes:  
      - ./data:/data/db

  create-service:
    container_name: create-service
    build: ./create-service
    ports:
      - "3001:3001"
    depends_on:
      - mongodb
    volumes:
      - ./create-service:/app
      - /app/node_modules
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/datamanagement

  delete-service:
    container_name: delete-service
    build: ./delete-service
    ports:
      - "3002:3002"
    depends_on:
      - mongodb
    volumes:
      - ./delete-service:/app
      - /app/node_modules
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/datamanagement

  read-service:
    container_name: read-service
    build: ./read-service
    ports:
      - "3003:3003"
    depends_on:
      - mongodb
    volumes:
      - ./read-service:/app
      - /app/node_modules
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/datamanagement

  update-service:
    container_name: update-service
    build: ./update-service
    ports:
      - "3004:3004"
    depends_on:
      - mongodb
    volumes:
      - ./update-service:/app
      - /app/node_modules
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/datamanagement

  api-gateway:
    container_name: api-gateway
    build: ./api-gateway
    ports:
      - "3000:3000"
    depends_on:
      - create-service
      - delete-service
      - read-service
      - update-service
    environment:
      - PORT=3000
      - CREATE_MS_URL=http://create-service:3001
      - UPDATE_MS_URL=http://update-service:3004
      - READ_MS_URL=http://read-service:3003
      - DELETE_MS_URL=http://delete-service:3002

  logs-service:
    container_name: logs-service
    build: ./logs-service
    ports:
      - "3005:3005"
    depends_on:
      - mongodb
    volumes:
      - ./logs-service:/app
      - /app/node_modules
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/datamanagement
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

## Novedades

1. **Implementación de Logs**

  Se han incorporado registros detallados (logs) en las siguientes operaciones:

  - Creación de usuario: Registra la información relevante de cada usuario creado.
  
  - Edición de usuario: Documenta los cambios realizados al usuario, incluyendo qué campos fueron modificados.
  
  - Eliminación de usuario: Crea un log de cada usuario eliminado para auditoría.
  
  - Consulta de usuario: Mantiene un registro de cada consulta realizada sobre los datos de los usuarios.

Estos logs permiten un seguimiento más detallado y transparente de las actividades realizadas en el sistema.

2. **Incorporación de API Gateway**

  Se ha implementado un API Gateway para centralizar los microservicios y gestionar todas las solicitudes mediante una sola ruta. Beneficios:

  - Centralización: Facilita el acceso a los diferentes microservicios desde una única URL.
  
  - Seguridad: Mejora el control sobre las solicitudes y respuestas.
  
  - Escalabilidad: Permite manejar un mayor volumen de peticiones con menor complejidad.

