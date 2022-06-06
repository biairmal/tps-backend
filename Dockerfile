FROM node:18-alpine

# Setting up working directory
RUN mkdir -p /app/api
WORKDIR /app/api

# Installing dependencies
COPY package.json .
COPY yarn.lock .

RUN apk update && apk add bash
RUN yarn install --production
RUN yarn add global sequelize-cli

# Copying source code
COPY . .

# Create folder for invoices
RUN mkdir -p /app/invoices
