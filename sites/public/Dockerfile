# Copied from nextjs.org/docs/deployment
# Build with: docker build . -t my-next-js-app
# Run with: docker run -p 3000:3000 my-next-js-app

# Install dependencies only when needed
FROM node:12.18-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app/sites/public
COPY package*.json ./

# TODO(wrl): remove --frozen-lockfile here??
RUN npm install
RUN npm config set unsafe-perm true

# Rebuild the source code only when needed
FROM node:12.18-alpine AS builder
WORKDIR /app/sites/public
COPY . .
RUN npm build && npm install --production --ignore-scripts --prefer-offline

# Production image, copy all the files and run next
FROM node:12.18-alpine AS runner
WORKDIR /app/sites/public

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/sites/public/next.config.js ./

USER nextjs

EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# ENV NEXT_TELEMETRY_DISABLED 1

CMD ["npm", "start"]