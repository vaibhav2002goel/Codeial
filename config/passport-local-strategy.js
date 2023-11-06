const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');
const { response } = require('express');

//Authentication using passport
passport.use(new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true //This helps us to use request in the callback
    },

    function(request,email,password,done){
        // Find a user and establish identity
        User.findOne({email:email})
        .then((user)=>{
            if(!user || user.password != password){
                request.flash('error',"Invalid Username/Password");
    
                return done(null,false);
            }
    
            return done(null,user);
        })
        .catch((error)=>{
            if(error){
                request.flash('error',error);
                return done(error);
            }
        })
    }

));

// Serializing the user to decide which key is to be kept in the cookie
passport.serializeUser(function(user,done){
    done(null,user.id);
})

// Deserializing the user from the key in the cookies
passport.deserializeUser(function(id,done){
    
    User.findById(id)
    .then((user)=>{
        return done(null,user);
    })
    .catch((error)=>{
        console.log("Error in finding user --> Passport");
        return done(error);
    })
})

//Check if user is authenticated
passport.checkAuthentication = function(request,response,next){
    
    // if the user is signed-in, then pass on the request to next function(Controller's action)
    if(request.isAuthenticated()){
        return next();
    }

    // if the user is not signed-in
    return response.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(request,response,next){
    if(request.isAuthenticated()){
        // request.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
        response.locals.user = request.user;    
    }

    next();
}

module.exports = passport;