# Setup Guide

Detailed guide for setting up the development server of the backend

## Setting up the development environment

- Create a `.env` file in the root folder
- Here's a boilerplate to configure it

**NOTE:** For mailer host we're using [mailtrap](https://mailtrap.io)

```bash
# Mailer
MAILER_PORT=465
MAILER_USER="ceab5fee72e492"
MAILER_PASS="d5a5d21e69e62c"
MAILER_HOST="smtp.mailtrap.io"

# PostgreSQL
DATABASE_URL=""

# MinIO
MINIO_ENDPOINT=""
MINIO_PORT=
MINIO_ACCKEY=""
MINIO_SECKEY=""
MINIO_USESSL=
MINIO_BUCKET=""

# Redis
REDIS_HOST=""
REDIS_PORT=
REDIS_PASS=

# JWT
JWT_PRIVATE_KEY=""
# Cookies
COOKIE_SECRET=""

# Auth
SALT_ROUNDS=10

# Env
NODE_ENV=""

# Allowed Origins
ORIGINS=[""]

# Slonik logging
ROARR_LOG=

# The URL of the front-end
BASE_FRONTEND_URL=
```

## Configuring SSL development environment

- Install Caddy

```
choco install caddy
```

- Start the server and caddy

```
yarn start
caddy run --config ./Caddyfile
```

### Starting the server

- Go to the root directory
- In the terminal type `yarn`
- After dependencies are done installing, type `yarn dev`
- Start the frontend server by running `yarn start` in frontend directory

### Endpoints

Here are HTTPS endpoints that are available via Caddy:

[Backend](https://localhost:5001) - https://localhost:5001

[Frontend](https://localhost:5000) - https://localhost:5000

### Running a cluster

- Go to the root directory and run

```bash
./scripts/run.sh
```

- To stop the cluster run

```bash
./scripts/stop.sh
```
