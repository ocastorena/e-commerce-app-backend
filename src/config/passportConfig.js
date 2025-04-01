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

// Facebook Login Strategy
const FacebookStrategy = require("passport-facebook").Strategy;

// Replace these with your actual credentials or load them from environment variables.
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:3000/login/facebook/callback",
      profileFields: ["id", "displayName", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if a user with the Facebook ID already exists in your database.
        let user = await getUserByFacebookId(profile.id);
        if (!user) {
          // If not, create a new user. You might also want to extract additional profile information.
          user = await createUser({
            facebookId: profile.id,
            username: profile.displayName,
            email: profile.emails && profile.emails[0].value, // Ensure email exists
            // Additional fields as needed.
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

module.exports = passport;
