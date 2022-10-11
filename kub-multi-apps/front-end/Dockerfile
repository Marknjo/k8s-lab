FROM node:lts-alpine as build

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

FROM nginx

WORKDIR /usr/share/nginx/html

COPY --from=build /app/build .

COPY conf/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8003
