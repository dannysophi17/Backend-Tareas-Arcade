#1. Imagen
FROM node:18-alpine

#2. Carpeta de trabajo
WORKDIR /app

#3. Instalación de dependencias
COPY package*.json ./
RUN npm install

#4. Copiar el resto de la aplicación
COPY . .

#5. Exponer el puerto
EXPOSE 3000

#6. Comando para iniciar la aplicación
CMD ["node", "index.js"]