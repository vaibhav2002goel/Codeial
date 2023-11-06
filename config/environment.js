const fs = require('fs')

// This is used to shift the data of the file to some other place when it exceeds the specified data limit of the log files
const rfs = require('rotating-file-stream');

const path = require('path');

const logDirectory = path.join(__dirname,'../production_logs')
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
});

const development = {
    name: 'development',
    asset_path: './assets',
    session_cookie_key: "Vaibhav",
    db: 'codial_development',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: true,
        auth:{
            user: 'vaibhav2002goel@gmail.com',
            pass: 'fgbr ffqf ncux cntj'
        }
    },
    google_client_id: "539756161746-f911ur133u3kcmj4acd8hpa5mnfqcth3.apps.googleusercontent.com",
    google_client_secret: "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",
    google_call_back_url: "http://localhost:8000/users/auth/google/callback",
    jwt_secret : 'codeial',
    morgan:{
        mode:'dev',
        options:{stream:accessLogStream}
    }
}

// For running in production environment we first need to install a package :: npm install -g win-node-env
const production = {
    name: process.env.CODEIAL_ENVIRONMENT,
    asset_path: process.env.CODEIAL_ASSET_PATH, //This has been set in the environment variables
    session_cookie_key: process.env.CODEIAL_SESSION_COOKIE_KEY, //This an be obtained from the website Randomkeygen.com
    db: process.env.CODEIAL_DB,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: true,
        auth:{
            user: process.env.CODEIAL_GMAIL_USERNAME,
            pass: process.env.CODEIAL_GMAIL_PASSWORD
        }
    },
    google_client_id: process.env.CODEIAL_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
    google_call_back_url: process.env.CODEIAL_GOOGLE_CALLBACK_URL,
    jwt_secret : process.env.CODEIAL_JWT_SECRET,
    morgan:{
        mode:'combined',
        options:{stream:accessLogStream}
    }

}

module.exports = eval(process.env.CODEIAL_ENVIRONMENT) == undefined ? development : eval(process.env.CODEIAL_ENVIRONMENT);