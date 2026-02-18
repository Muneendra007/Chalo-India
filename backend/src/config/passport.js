const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/v1/users/auth/google/callback" // Adjust based on environment
},
    async function (accessToken, refreshToken, profile, cb) {
        try {
            let user = await User.findOne({ email: profile.emails[0].value });
            if (!user) {
                // Create user
                // We need a dummy password. Validation requires minlength 8.
                const dummyPassword = 'google-auth-' + Date.now();
                user = await User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: dummyPassword,
                    passwordConfirm: dummyPassword,
                    isVerified: true
                });
            } else if (!user.isVerified) {
                // If user exists but unverified, verify them since they signed in with Google
                user.isVerified = true;
                await user.save({ validateBeforeSave: false });
            }
            return cb(null, user);
        } catch (err) {
            return cb(err, null);
        }
    }
));

module.exports = passport;
