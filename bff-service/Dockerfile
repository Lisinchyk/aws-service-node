#Base
FROM node:16-alpine AS base

WORKDIR /app

#Dependencies
COPY package*.json ./
RUN npm install

#Build
WORKDIR /app
COPY . .
RUN npm start

CMD ["node", "inedx.js"]