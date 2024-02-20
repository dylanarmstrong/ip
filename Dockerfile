FROM node:20-alpine

ARG build

LABEL maintainer="Dylan Armstrong <dylan@dylan.is>"

WORKDIR /app

RUN npm i -g pnpm

COPY package.json pnpm-lock.yaml public.pem tsconfig.json ./

RUN pnpm install --frozen-lockfile

COPY scripts/ ./scripts
COPY src/ ./src

RUN if [[ "$build" == "true" ]]; then \
  pnpm run build; \
  pnpm prune --prod; \
fi

EXPOSE 80/tcp

CMD [ "sh", "./scripts/docker-init.sh" ]
