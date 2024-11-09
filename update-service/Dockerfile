# Usar una imagen base de Node.js
FROM node:18

# Crear el directorio de trabajo para la aplicación
WORKDIR /app

# Copiar todos los archivos del read-service
COPY . .

# Instalar las dependencias
RUN npm install

# Compilar TypeScript a JavaScript
RUN npm run build

# Exponer el puerto en el que corre el servicio (ajústalo si es necesario)
EXPOSE 3004

# Comando para iniciar el servicio de lectura
CMD ["npm", "run", "dev"]
