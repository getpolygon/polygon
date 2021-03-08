#! /bin/bash

npm i pm2 -g && \
pm2 start --name backend -i -1 ./src/index.js && \
pm2 monit