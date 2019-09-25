FROM node:10-alpine

WORKDIR /usr/src/split-evaluator

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 7548

ENV SPLIT_EVALUATOR_SERVER_PORT=7548

ENTRYPOINT ["npm", "start"]
