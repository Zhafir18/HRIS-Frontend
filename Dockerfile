# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

# Build with production API URL
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5001

CMD ["nginx", "-g", "daemon off;"]
