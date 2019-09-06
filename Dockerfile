FROM node:10

WORKDIR usr/src/split-evaluator

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 7548

ENV SPLITIO_SERVER_PORT=7548

ENTRYPOINT ["npm", "start"]
