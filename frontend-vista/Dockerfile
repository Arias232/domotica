# Usa una imagen de Node oficial como base
FROM node:16-alpine

# Establece el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia el archivo package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia todo el código
COPY . .

# Exponer el puerto
EXPOSE 4000

CMD ["npm", "run", "dev"]