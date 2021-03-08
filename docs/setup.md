# Setup Guide

Detailed guide for setting up the development server of the backend

## Setting up the development environment

- Create a `.env` file in the root folder
- Here's a boilerplate to configure it

```bash
# Mailer Helper

# SMTP
MAILER_HOST=
MAILER_EMAIL=
MAILER_PASS=
MAILER_PORT=

# MinIO

MINIO_ENDPOINT=
MINIO_PORT=
MINIO_ACCKEY=
MINIO_SECKEY=
MINIO_USESSL=
MINIO_BUCKET=

# MongoDB
MONGO_URI=
MONGO_CLUSTER=
MONGO_USER=
MONGO_PASS=

# Redis
REDIS_HOST=
REDIS_PORT=
REDIS_PASS=

# JWT
JWT_TOKEN=
JWT_REFRESH_TOKEN=

# Node.js environment
NODE_ENV=development
```

## Configuring SSL development environment

- After configuring everything you'll need to create a `cert/` folder and cd to it

```bash
mkdir cert && cd cert
```

- In the terminal copy/paste the following commands

```bash
# Generating private key
openssl genrsa -out key.pem
# Here press enter every time and do not give any input
openssl req -new -key key.pem -out csr.pem
# Generating the SSL cert
openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem
```

### Configuring Google Chrome

- Open Google Chrome and go to `chrome://flags`
- Search for `Allow invalid certificates for resources loaded from localhost` and enable it
- Restart the browser

### Starting the server

- Go to the root directory
- In the terminal type `yarn`
- After dependencies are done installing, type `yarn dev` and visit `localhost:3001` to make sure everything is working
