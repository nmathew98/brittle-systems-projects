FROM node:latest

RUN mkdir -p /srv/api
WORKDIR /srv/api

ENV PORT 4000

EXPOSE 4000

COPY serve.config.ts /srv/api
COPY package.json /srv/api
COPY tsconfig.json /srv/api
COPY .env /srv/api/
COPY src /srv/api/

ENV NODE_ENV development
RUN corepack pnpm install
ENV NODE_ENV production

RUN corepack pnpm build

CMD ["node", "--experimental-fetch", ".output/app.mjs"]