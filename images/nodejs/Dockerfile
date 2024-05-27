FROM node:20-alpine

WORKDIR ~/app

COPY ./execute.js ./execute.js
COPY ./package.json ./package.json 
COPY ./yarn.lock ./yarn.lock
COPY ./.pnp* ./
COPY ./.yarn ./.yarn

RUN yarn install

ENTRYPOINT ["yarn", "execute"]