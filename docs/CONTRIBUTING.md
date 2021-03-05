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
MAILER_HOST=smtp.gmail.com
# The email of sender
MAILER_EMAIL=michael.grigoryan25@gmail.com
# The password of the app (when using Google apps(Like Gmail))
MAILER_PASS=ociepfvbbvtklvdz
# The SMTP port
MAILER_PORT=465

# Global vars

# Express.js session secret
EXPRESS_SECRET=4a9a04bd33c2b426ffa892a2e24d63bb369f814a6020eed456ddbe485543088877934b9c9f491486ec0d0253b7cd193a

# MinIO

# The MinIO endpoint (most of the time localhost:9000)
MINIO_ENDPOINT=localhost
# The port of MinIO instance
MINIO_PORT=9000
# The access key of MinIO
MINIO_ACCKEY=minioadmin
# The secret key of MinIO
MINIO_SECKEY=minioadmin
# If MinIO has a HTTP Certificate set to true else set to false
MINIO_USESSL=false
# The bucket that'll be used by MinIO
MINIO_BUCKET=local

# MongoDB

# Your MongoDB endpoint
MONGO_URI=mongodb://localhost:27017
# Your MongoDB database name
MONGO_CLUSTER=Cluster0
# The user of the database
MONGO_USER=
# The password of the database
MONGO_PASS=

# JWT TOKEN

# Your JWT token that'll need to be generated manually by you
JWT_TOKEN=14b94cd8a1f977912dcfa1cc565b817bd889c278c52dece554f4fe12dbe11ed80854782d1949b1c2a5547dfdbb388697
# Your JWT refresh token that'll need to be generated manually by you
JWT_REFRESH_TOKEN=ea4aafed1374bde47707f1b3d0329936573ecb581809479812101f69a91f6947cf7537985ab264a7d78fd9e6e41b853c

# Node.js

# Your Node.js environment
NODE_ENV=development
```
