# dist
FROM node:20.10.0-alpine as dist

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY tsconfig*.json ./

COPY nest-cli.json ./

COPY src ./src

RUN npx prisma generate

RUN npm run build

# install production dependencies
FROM node:20.10.0-alpine as install

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

# start
FROM node:20.10.0-alpine AS start

WORKDIR /app

ENV NODE_ENV dev

COPY --from=dist app/src/vendor ./src/vendor

COPY --from=dist app/dist ./dist

COPY --from=install app/node_modules  ./node_modules

COPY --from=dist /app/node_modules/.prisma/client  ./node_modules/.prisma/client

COPY package*.json ./

COPY .env.prod.yaml ./

COPY entrypoint.sh ./

ENTRYPOINT ["./entrypoint.sh"]