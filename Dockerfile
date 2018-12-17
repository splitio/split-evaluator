FROM node:9.11.2-alpine
RUN mkdir split-evaluator
WORKDIR split-evaluator
EXPOSE 7549

COPY . .

RUN apk update && apk upgrade
RUN apk add bash
RUN apk add git
RUN rm -rf /var/cache/apk/*
RUN npm install

ENV SPLITIO_SERVER_PORT=7549
ENTRYPOINT [ "./docker-entrypoint.sh" ]
