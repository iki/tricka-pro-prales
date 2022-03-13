# Reference: https://docs.docker.com/engine/reference/builder/

FROM node:16-alpine

ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV

WORKDIR /server

# Cache installed dependencies unless package metadata change
COPY package*.json .

RUN npm install --production --no-save

COPY . .

EXPOSE 7000

CMD npm start

