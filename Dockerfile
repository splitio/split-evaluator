# Builder stage
FROM harness0.harness.io/oci/docker_artifacts/hhi/node:24.22.0 AS builder

# Build stage only: needed to create and write the work dir. Not used at runtime.
USER root

WORKDIR /usr/src/split-evaluator

COPY package.json package-lock.json ./

RUN npm install --only=production

# Runner stage
FROM harness0.harness.io/oci/docker_artifacts/hhi/node:24.22.0 AS runner

# The base image runs as uid 1000 (non-root) by default.
USER root
WORKDIR /usr/src/split-evaluator
RUN chown 1000:1000 /usr/src/split-evaluator

USER 1000

COPY --from=builder --chown=1000:1000 /usr/src/split-evaluator/node_modules ./node_modules

COPY --chown=1000:1000 . .

EXPOSE 7548

ENV SPLIT_EVALUATOR_SERVER_PORT=7548

ENTRYPOINT ["npm", "start"]
