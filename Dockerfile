FROM node:14.17.0

WORKDIR /code

COPY . .

RUN yarn

RUN yarn build

EXPOSE 3001

CMD ["node", "./build/server.js"]
