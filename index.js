const express = require('express');
const env = require('./config/environment');

// HTTP request logger middleware for node.js
const logger = require('morgan');

const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

// Helper
require('./config/view-helpers')(app)

// Used for session cookie
const session = require('express-session');

//Passport Local Strategy
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');

//Passport JWT Strategy //Passport is already imported when we establies our passport local strategy
const passportJWT = require('./config/passport-jwt-strategy')

// Passport social authentication(Google)
const passportGoogle = require('./config/passport-google-oauth2-strategy');

//For storing cookies in mongo-store
const MongoStore = require('connect-mongo');

// Flash :: For installing run --> npm install connect-flash
const flash = require('connect-flash');
const customMware = require('./config/middleware');

// Morgan
app.use(logger(env.morgan.mode,env.morgan.options));

// Socket in chats
// Setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log("Chat server is listening on port number 5000")

app.use(express.urlencoded({extended:true}));

app.use(cookieParser());

app.use(express.static(env.asset_path));

// Make the uploads path available to the browser
app.use('/uploads',express.static(__dirname + '/uploads'));

app.use(expressLayouts); //Put it before the routes
//Extract style and scripts from subpages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//set up the view engine
app.set('view engine','ejs')
app.set('views','./views');

//mongo store is used to store the session cookie in the db
app.use(session({
    name : 'codial',
    secret: env.session_cookie_key, //This needs to be give carefully

    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create(
        {
            mongoUrl: 'mongodb://localhost/codial_database' ,
            autoRemove: 'disabled'
        }
    )
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser); // Self-made Middleware

app.use(flash());
app.use(customMware.setFlash);

//ROUTES
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));


app.listen(port,function(error){
    if(error){
        // console.log('Error : ',error);
        console.log(`Error in running the server : ${error}`);
    }

    console.log(`Server is running on port : ${port}`);
})