ARG NODE_ENV=development
FROM node:alpine

RUN mkdir -p /srv/api
WORKDIR /srv/api

# ESBuild is platform specific
COPY ./. ./
RUN rm -rf ./node_modules

ENV REFRESH_COUNT 0

ENV NODE_ENV development
RUN corepack pnpm install
ENV NODE_ENV ${NODE_ENV}

CMD corepack pnpm start
