FROM node:14-alpine

LABEL maintainer="Dylan Armstrong <dylan@dylan.is>"

WORKDIR /app

COPY config.json ./
COPY ip.db ./
COPY package-lock.json ./
COPY package.json ./
COPY server.js ./

RUN \
  apk add --no-cache --update --virtual \
    .gyp \
    g++ \
    make \
    python3 \
  && \
  npm i -g npm \
  && \
  npm install \
  && \
  apk del \
    .gyp

EXPOSE 80/tcp

CMD [ "node", "server.js" ]
