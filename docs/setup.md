# Setup Guide

Detailed guide for setting up the development server of the backend

## Setting up the development environment

- Create a `.env` file in the root folder
- Here's a boilerplate to configure it

**NOTE:** For mailer host we're using [mailtrap](https://mailtrap.io)

```bash
# Mailer Helper

# SMTP
MAILER_PORT=465
MAILER_USER=ceab5fee72e492
MAILER_PASS=d5a5d21e69e62c
MAILER_HOST=smtp.mailtrap.io

# MinIO
MINIO_ENDPOINT=
MINIO_PORT=
MINIO_ACCKEY=
MINIO_SECKEY=
MINIO_USESSL=
MINIO_BUCKET=

# Redis
REDIS_HOST=
REDIS_PORT=
REDIS_PASS=

# JWT
JWT_PRIVATE_KEY=RANDOM_STRING

# Auth
SALT_ROUNDS=INTEGER

# Cookies
COOKIE_SECRET=RANDOM_STRING

NODE_ENV=development

# This text is inserted by `prisma init`:
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#using-environment-variables

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQL Server and SQLite.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

DATABASE_URL="POSTGRESQL_URL"

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

### Running a cluster

- Go to the root directory and run

```bash
./scripts/run.sh
```

- To stop the cluster run

```bash
./scripts/stop.sh
```
