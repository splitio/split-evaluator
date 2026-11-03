# Builder stage
FROM harness0.harness.io/oci/docker_artifacts/rf-curated/node:24.22.1-alpine3.23-rfcurated AS builder

USER root

WORKDIR /usr/src/split-evaluator

COPY package.json package-lock.json ./

RUN npm install --only=production

# Runner stage
FROM harness0.harness.io/oci/docker_artifacts/rf-curated/node:24.22.1-alpine3.23-rfcurated AS runner

USER root

WORKDIR /usr/src/split-evaluator

COPY --from=builder /usr/src/split-evaluator/node_modules ./node_modules

COPY . .

RUN chmod -R a+rX /usr/src/split-evaluator

EXPOSE 7548

ENV SPLIT_EVALUATOR_SERVER_PORT=7548

ENTRYPOINT ["npm", "start"]
