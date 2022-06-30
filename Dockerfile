FROM node:14.18-alpine3.15
RUN apk add --no-cache git

# Install app dependencies
RUN mkdir -p /app/node_modules
WORKDIR /app
COPY ./app /app

RUN npm install
