#! /bin/bash

pm2 start --name backend -i 3 src/index.js --no-autorestart && pm2 monit