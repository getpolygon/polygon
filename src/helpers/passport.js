const { JWT_PRIVATE_KEY } = process.env;

const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const LocalStrategy = require("passport-local").Strategy;

// Local strategy for logging in and verifying users
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (email, password, done) => {
      console.log({ email, password });
      done(null, { email, password });
    }
  )
);

// JWT strategy for gaining access to the API
passport.use(
  new JwtStrategy(
    {
      secretOrKey: JWT_PRIVATE_KEY,
      jwtFromRequest: (req) => req.cookies.jwt,
    },
    (payload, done) => {
      console.log({ payload });
    }
  )
);
