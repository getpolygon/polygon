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
- In the `.env` file paste this line `mongo=YOUR_MONGODB_URI`
- Open up the terminal and run `npm start` or `npm run dev` in a development environment

After you've done these steps you can open `localhost:3000` in your browser.

## Configuring MinIO

### Steps to reproduce

- Move to the project root
- Create a file and name it `minio.config.js`
- Update your settings respectively

```js
module.exports = {
  HOST: "The MinIO host endpoint",
  PORT: 9000, // Change it to the port of the MinIO host (9000 in the most cases)
  ACCKEY: "12345678", // Change these to your keys
  SECKEY: "12345678", // Change these to your keys
  USESSL: false, // false by default
  BUCKET: "YOUR_BUCKET_NAME"
};
```

## Configuring Mailer

### Steps to reproduce

- Create a `email.js` file in `config/`

```js
module.exports = {
  email: "<EMAIL_THAT_YOU_WANT_TO_USE>",
  password: "<YOUR_APP/ACCOUNT_PASSWORD>", // https://myaccount.google.com/apppasswords
  port: 465,
  secure: true, //
  host: "YOUR_SMTP_HOST"
};
```

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

# Mongoose models

We have 1 main model and 2 subdocuments.
<br />

## Main model

[Account Model](./models/account.js)

<br />

## Subdocuments

[Post Model](./models/post.js)

[Friend Model](./model/friend.js)

<hr>

## Links

[LICENSE](./LICENSE)
