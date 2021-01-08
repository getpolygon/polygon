# ArmSocial — Social Network Made By an Armenian

<br>

## Cloning the repository

```bash
git clone https://github.com/MichaelGrigoryan25/ArmSocial
```

## After cloning the repository

### Reproduce these steps

- Open the terminal and run `npm install`
- Create a `.env` file at the project's root folder
- Create the following environment variables

```
  # Mailer Helper
  MAILER_host=SMTP_HOST # Your SMTP host
  MAILER_email=SENDER_EMAIL # The email of sender
  MAILER_password=SMTP_PASSWORD # The password of the app (when using Google apps(Like Gmail))
  MAILER_secure=SMTP_SECURE # SMTP is secure
  MAILER_port=SMTP_PORT # The SMTP port

  # Global vars
  EXPRESS_SECRET=EXPRESS_SECRET # Express.js session secret

  # MinIO
  MINIO_ENDPOINT=MINIO_ENDPOINT # The MinIO endpoint (most of the time localhost:9000)
  MINIO_PORT=MINIO_PORT # The port of MinIO instance
  MINIO_ACCKEY=MINIO_ACCESS_KEY # The access key of MinIO
  MINIO_SECKEY=MINIO_SECRET_KEY # The secret key of MinIO
  MINIO_USESSL=MINIO_USE_SSL # If MinIO has a HTTP Certificate set to true else set to false
  MINIO_BUCKET=MINIO_BUCKET # The bucket that'll be used by MinIO

  # MongoDB
  MONGO_URI=MONGO_DB_URI # Your MongoDB endpoint
  MONGO_CLUSTER=DATABASE_NAME # Your MongoDB database name
  MONGO_USER=MONGO_USER # The user of the database
  MONGO_PASS=MONGO_PASS # The password of the database

  # JWT TOKEN
  JWT_TOKEN=RANDOM_HEXADEMICAL_STRING # Your JWT token that'll need to be generated manually by you
  JWT_REFRESH_TOKEN=RANDOM_HEXADEMICAL_STRING # Your JWT refresh token that'll need to be generated manually by you

  # Node.js
  NODE_ENV=production # Your Node.js environment
```

- Open up the terminal and run `npm start` or `npm run dev` in a development environment

After you've done these steps you can open `localhost:3000` in your browser.

## CSS Framework(s) Used

- Bootstrap

## Templating engine(s) Used

- EJS

## Database(s) Used

- MongoDB ( For Documents )
- MinIO ( Object Storage )

## NPM dependencies Used

```json
"dependencies": {
    "body-parser": "^1.19.0",
    "compression": "^1.7.4",
    "cookie-parser": "^1.4.5",
    "cors": "^2.8.5",
    "date-fns": "^2.16.1",
    "dotenv": "^8.2.0",
    "ejs": "^3.1.5",
    "email-validator": "^2.0.4",
    "express": "^4.17.1",
    "express-session": "^1.17.1",
    "minio": "^7.0.16",
    "moment": "^2.29.1",
    "mongoose": "^5.10.9",
    "morgan": "^1.10.0",
    "multer": "^1.4.2",
    "node-fetch": "^2.6.1"
},
"devDependencies": {
    "nodemon": "^2.0.5"
}
```

## Links

[LICENSE](./LICENSE)
