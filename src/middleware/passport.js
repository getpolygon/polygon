const { JWT_TOKEN } = process.env;

const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const LocalStrategy = require("passport-local").Strategy;

passport.use(
	new LocalStrategy(
		{
			usernameField: "email",
			passwordField: "password"
		},
		(email, password, done) => {
			console.log({ email, password });
		}
	)
);

passport.use(
	new JwtStrategy(
		{
			secretOrKey: JWT_TOKEN,
			jwtFromRequest: (req) => req.cookies.jwt
		},
		(payload, done) => {
			console.log({ payload });
			console.log("in auth");
			done(null, "hi");
		}
	)
);
