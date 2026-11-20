# Builder stage
FROM node:24.22.3-alpine3.24 AS builder

WORKDIR /usr/src/split-evaluator

COPY package.json package-lock.json ./

RUN npm install --only=production

# Runner stage
FROM node:24.22.3-alpine3.24 AS runner

WORKDIR /usr/src/split-evaluator

# Pull in Alpine security fixes published after the base image was built (zlib, openssl),
# and update the npm bundled with the Node image (fixes bundled undici and brace-expansion).
RUN apk upgrade --no-cache \
    && npm install -g npm@12.2.3 \
    && npm cache clean --force

COPY --from=builder /usr/src/split-evaluator/node_modules ./node_modules

COPY . .

RUN chmod -R a+rX /usr/src/split-evaluator

EXPOSE 7548

ENV SPLIT_EVALUATOR_SERVER_PORT=7548

ENTRYPOINT ["npm", "start"]
