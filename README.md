# ArmSocial - social network for Armenians
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
* Bulma
* UIKit

## Templating engine(s) Used
* EJS

## Database(s) Used
* MongoDB ( for documents )
* Firebase Storage ( for images )

## Cookie parser Used
* npm install `cookie-parser`

## NPM dependencies Used
```json
"dependencies": {
    "body-parser": "^1.19.0",
    "cookie-parser": "^1.4.5",
    "dotenv": "^8.2.0",
    "ejs": "^3.1.5",
    "express": "^4.17.1",
    "mongoose": "^5.10.9"
},
"devDependencies": {
    "nodemon": "^2.0.5"
}
```

# Mongoose models
## Account model
```js
fullName: { type: String, required: true },
email: { type: String, required: true },
password: { type: String, required: true, minlength: 8},
bio: { type: String, required: false },
pictureUrl: { type: String, required: true }, 
private: { type: Boolean, required: true },
date: { type: String, required: true }
```

<hr>

## Links
### [LICENSE](./LICENSE)