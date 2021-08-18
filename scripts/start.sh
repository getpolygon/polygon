#! /bin/bash

# Move to root dir
cd ..

# Installing deps
yarn

# Logging pending migrations
node migrate pending
# Applying pending migrations
node migrate up

# Starting the server
yarn start
