FROM node:12.18 AS build-deps

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
RUN yarn install --focus

COPY . .

EXPOSE 9009
CMD ["yarn", "start", "-p", "9009"]