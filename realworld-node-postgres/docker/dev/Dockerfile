FROM node:alpine

RUN mkdir -p /srv/app
WORKDIR /srv/app

COPY ./. ./

RUN NODE_ENV=development corepack pnpm install

CMD NODE_ENV=development corepack pnpm dev
