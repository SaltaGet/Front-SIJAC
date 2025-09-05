FROM node:22.1.0-slim AS builder

WORKDIR /app
COPY package*.json ./
COPY .env .env  
COPY . .  

RUN npm install
RUN npm run build  # Genera la carpeta /app/dist

# Etapa 2: Servir con Nginx
FROM nginx:1.25-alpine

# Copia los archivos construidos desde la etapa builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expone el puerto 80 (puerto por defecto de Nginx)
EXPOSE 80


# # Etapa 1: Construir la aplicación (builder)
# FROM node:22.1.0-slim AS builder

# WORKDIR /app
# COPY package*.json ./
# COPY . .  

# RUN npm install
# RUN npm run build  # Genera la carpeta /app/dist

# # Etapa 2: Servir con Nginx
# FROM nginx:1.25-alpine

# # Copia los archivos construidos desde la etapa builder
# COPY --from=builder /app/dist /usr/share/nginx/html

# # Opcional: Copia una configuración personalizada de Nginx
# # COPY nginx.conf /etc/nginx/conf.d/default.conf

# # Expone el puerto 80 (puerto por defecto de Nginx)
# EXPOSE 80
