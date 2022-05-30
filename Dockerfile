FROM node:16.15

RUN mkdir -p /services/app/tps-api
WORKDIR /services/app/tps-api

COPY package.json /services/app/tps-api
COPY yarn.lock /services/app/tps-api

RUN yarn install
RUN yarn add global sequelize-cli

COPY . /services/app/tps-api

