FROM node:12.9.1

WORKDIR /code

COPY . .

RUN yarn
RUN yarn build

EXPOSE 3001

CMD ["yarn", "start"]
