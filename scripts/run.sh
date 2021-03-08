#! /bin/bash

pm2 start --name backend -i -1 src/index.js --no-autorestart

pm2 monit
