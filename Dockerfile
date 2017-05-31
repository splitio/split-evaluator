FROM alpine:3.5
 RUN mkdir callhome-nodejs
 WORKDIR callhome-nodejs
 EXPOSE 4444

 COPY . .

 RUN apk update && apk upgrade
 RUN apk add bash
 RUN apk add git
 RUN apk add nodejs
 RUN rm -rf /var/cache/apk/*
 RUN npm install --save