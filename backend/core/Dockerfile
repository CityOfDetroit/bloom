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

RUN yarn install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

EXPOSE ${PORT}

# TODO(wrl): determine whether this should be in a post-build step in the cloud.
RUN yarn db:migration:run

# If you attempt to run this by itself, you'll need to pass in:
# PORT, DATABASE_URL, REDIS_URL, REDIS_TLS_URL
# Typically via docker run my-app --env-file=".env"
CMD ["yarn", "start"]
