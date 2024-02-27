FROM node:alpine AS base
RUN mkdir -p /srv/app
WORKDIR /srv/app
COPY ./. .
RUN NODE_ENV=development corepack pnpm install

FROM base as test
RUN corepack pnpm test

FROM base as builder
RUN corepack pnpm build
RUN cp package.json ./dist/ && cp -rf node_modules ./dist/
RUN mkdir /secrets && \
	echo $JWT_ACCESS_SECRET > /secrets/jwt_access_secret && \
	echo $JWT_REFRESH_SECRET > /secrets/jwt_refresh_secret && \
	echo $JWT_INTERNAL_SECRET > /secrets/jwt_internal_secret

FROM node:alpine
LABEL maintainer="55116576+nmathew98@users.noreply.github.com"
COPY --from=builder /secrets /secrets
COPY --from=builder /srv/app/dist ./.
CMD NODE_ENV=production node index.mjs
