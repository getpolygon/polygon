const accountErrors = require("./account/account.errors");
const fieldErrors = require("./field/field.errors");
const friendErrors = require("./friend/friend.errors");
const jwtErrors = require("./jwt/jwt.errors");
const networkErrors = require("./network/network.errors");
const postErrors = require("./post/post.errors");
const registrationErrors = require("./registration/registration.errors");
const searchErrors = require("./search/search.errors");
const unexpectedErrors = require("./unexpected/unexpected.errors");
const verificationErrors = require("./verification/verification.errors");

module.exports = {
	jwt: jwtErrors,
	unexpected: unexpectedErrors,

	auth: {
		fields: fieldErrors,
		verification: verificationErrors,
		registration: registrationErrors
	},

	api: {
		post: postErrors,
		search: searchErrors,
		friend: friendErrors,
		account: accountErrors,
		network: networkErrors,
		account: accountErrors
	}
};
