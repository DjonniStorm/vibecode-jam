FROM node:24-slim AS base

WORKDIR /app/frontend

COPY . .

RUN npm install

RUN npm run build

FROM nginx:stable-alpine AS production

COPY --from=base /app/frontend/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
