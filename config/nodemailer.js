// Need to populate my user

const nodeMailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const env = require('./environment')

let transporter = nodeMailer.createTransport(env.smtp);

// relativePath : It is the path from where this function is being called
let renderTemplate = (data,relativePath)=>{
    let mailHTML
    ejs.renderFile(
        path.join(__dirname,'../views/mailers',relativePath),
        data,
        function(err,template){
            if(err){
                console.log("Error in rendering template "+err);
                return;
            }
            mailHTML = template;
        }
    )

    return mailHTML;
}

module.exports = {
    transporter:transporter,
    renderTemplate:renderTemplate
}