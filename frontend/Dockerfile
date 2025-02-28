# Etapa 1: Build
FROM node:22 AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Servir com Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Adicione uma configuração personalizada do Nginx se necessário
COPY etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 3030
CMD ["nginx", "-g", "daemon off;"]
