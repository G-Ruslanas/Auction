const GoogleStrategy = require("passport-google-oauth20").Strategy;
const localStrategy = require("passport-local").Strategy;
const passport = require("passport");
const User = require("./models/user");
const bcrypt = require("bcryptjs");

const GOOGLE_CLIENT_ID =
  "780408703363-a0n9jat99712d4q1u3m7iqrksr6k80sa.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOrCreate(
        { googleId: profile.id },
        { username: profile.displayName },
        (err, user) => {
          return done(err, user);
        }
      );
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
