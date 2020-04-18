FROM node:alpine

WORKDIR /server

COPY package.json package-lock.json ./

RUN npm install

COPY ./config ./config

COPY ./middleware ./middleware

COPY ./models ./models

COPY ./routes ./routes

COPY server.js ./

EXPOSE 5000

CMD [ "npm", "start" ]