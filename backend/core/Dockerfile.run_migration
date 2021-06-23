FROM node:12.16-alpine AS development

WORKDIR /usr/src/app

# Supports an optional yarn.lock
COPY package.json yarn*.lock tsconfig*.json ./

RUN yarn install

COPY . .

RUN yarn build

FROM node:12.16-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# Supports an optional yarn.lock
COPY package.json yarn*.lock tsconfig*.json ./

# This should really be --only=production, but we need the devDependencies for db:migration:run
RUN yarn install --production=false

COPY . .

COPY --from=development /usr/src/app/dist ./dist

EXPOSE ${PORT}

# If you attempt to run this by itself, you'll need to pass in:
# PORT, DATABASE_URL, REDIS_URL, REDIS_TLS_URL
# Typically via: docker run --env-file=".env" -t my-app
# Here we use the shell in order to pass in multiple commands.
CMD /bin/sh -c "yarn db:migration:run && yarn start"
