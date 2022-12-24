FROM node:16-alpine

LABEL maintainer="Dylan Armstrong <dylan@dylan.is>"

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm i -g npm
RUN npm ci

COPY public.pem server.js ./

EXPOSE 80/tcp

CMD [ "node", "server.js" ]
