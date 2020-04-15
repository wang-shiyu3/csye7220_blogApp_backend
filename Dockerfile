FROM node:alpine

WORKDIR /server

COPY package.json package-lock.json ./

RUN npm install

COPY ./config ./config

COPY ./middleware ./middleware

COPY ./models ./models

COPY ./routes ./routes

COPY server.js ./

ENV CLIENT=http://192.168.99.109:31980

ENV PORT=5000

EXPOSE 5000

CMD [ "npm", "start" ]