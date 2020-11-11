# ArmSocial — Social Network Made By an Armenian
<br>

## Cloning the repository
```bash
git clone https://github.com/MichaelGrigoryan25/ArmSocial
```

## After cloning the repository
### Reproduce these steps
* Open the terminal and run `npm install`
* Create a `.env` file at the project's root folder
* In the `.env` file paste this line `mongo=YOUR_MONGODB_URI`
* Open up the terminal and run `npm start` or `npm run dev` in a development environment

After you've done these steps you can open `localhost:3000` in your browser.

## CSS Framework(s) Used
* Bootstrap

## Templating engine(s) Used
* EJS

## Database(s) Used
* MongoDB ( For Documents )
* MinIO ( Object Storage )

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
