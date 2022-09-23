FROM node:lts-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "pnpm", "start"]