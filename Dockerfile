FROM node:16-alpine

LABEL maintainer="Dylan Armstrong <dylan@dylan.is>"

WORKDIR /app

COPY package.json package-lock.json public.pem ./

RUN npm i -g npm
RUN npm ci --omit=dev

COPY lib/server.js ./

EXPOSE 80/tcp

CMD [ "node", "server.js" ]
