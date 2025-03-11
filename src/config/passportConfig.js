const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { getUserByEmail, getUserById } = require("../models/userModel");

passport.use(
  new LocalStrategy(
    { usernameField: "email" }, // Specify that the username field is "email"
    async (email, password, done) => {
      try {
        // Fetch user by email from the database
        const user = await getUserByEmail(email);
        if (!user) {
          return done(null, false, { message: "Incorrect email." });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password." });
        }

        // if email and password are correct, return the user
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
