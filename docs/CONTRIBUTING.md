# Contribution guide

## Getting started

- Clone the repo

```bash
# With GitHub CLI
gh repo clone michaelgrigoryan25/armsocial-backend
```

- Create a `.env` file
- Copy and paste and change all the parameters according to your configuration

```bash
# Mailer Helper

# Your SMTP host
MAILER_HOST=
# The email of sender
MAILER_EMAIL=
# The password of the app (when using Google apps(Like Gmail))
MAILER_PASS=
# The SMTP port
MAILER_PORT=

# Global vars

# Express.js session secret
EXPRESS_SECRET=

# MinIO

# The MinIO endpoint (most of the time localhost:9000)
MINIO_ENDPOINT=
# The port of MinIO instance
MINIO_PORT=
# The access key of MinIO
MINIO_ACCKEY=
# The secret key of MinIO
MINIO_SECKEY=
# If MinIO has a HTTP Certificate set to true else set to false
MINIO_USESSL=
# The bucket that'll be used by MinIO
MINIO_BUCKET=

# MongoDB

# Your MongoDB endpoint
MONGO_URI=
# Your MongoDB database name
MONGO_CLUSTER=
# The user of the database
MONGO_USER=
# The password of the database
MONGO_PASS=

# JWT TOKEN

# Your JWT token that'll need to be generated manually by you
JWT_TOKEN=
# Your JWT refresh token that'll need to be generated manually by you
JWT_REFRESH_TOKEN=

```
