const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const AccountSchema = require("../models/account");

module.exports = (passport) => {
    passport.use(
        new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
            AccountSchema.findOne({ email: email })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: "Didn't find a user with that email" });
                    }

                    // Match password
                    bcrypt.compare(password, Account.password, (err, isMatch) => {
                        if (err) throw err;

                        if (isMatch) {
                            return done(null, Account)
                        } else {
                            return done(null, false, { message: "Password is incorrect" })
                        }
                    });
                })
                .catch(e => console.log(e))
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}