const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const env = require('./environment')

// Tell passport to use new strategy for google login
passport.use(new googleStrategy({
        clientID: env.google_client_id,
        clientSecret: env.google_client_secret,
        callbackURL: env.google_call_back_url,
    },

    function(accessToken, refreshToken, profile, done){
        // Find a user
        User.findOne({email:profile.emails[0].value}).exec()
        .then((user)=>{

            console.log(accessToken);
            console.log(refreshToken);
            console.log(profile);

            if(user){
                // If found set this user as request.user(sign-in that user)
                return done(null,user);
            }
            else{
                // if not found, create the user and set it as request.user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                })
                .then((user)=>{
                    return done(null,user);
                })
                .catch((error)=>{
                    console.log("Error in creating the user in google strategy-passport",error);
                    return;
                })
            }
        })
        .catch((error)=>{
            console.log("error in google strategy password : "+error);
                return;
        })
    }
))