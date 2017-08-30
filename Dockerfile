FROM alpine:3.5
RUN mkdir callhome-nodejs
WORKDIR callhome-nodejs
EXPOSE 7548

COPY . .

RUN apk update && apk upgrade
RUN apk add bash
RUN apk add git
RUN apk add nodejs
RUN rm -rf /var/cache/apk/*
RUN npm install

ENV SPLITIO_SERVER_PORT=7548
ENTRYPOINT ["npm", "start"]
