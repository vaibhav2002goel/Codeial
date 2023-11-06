const nodeMailer = require('../config/nodemailer');

exports.newComment = (comment)=>{

    // console.log("Inside New Comment ",comment);

    let htmlString = nodeMailer.renderTemplate({comment:comment},'/comments/new_comment.ejs')

    nodeMailer.transporter.sendMail({
        from: '21mcme24@uohyd.ac.in',
        to: comment.user.email,
        subject: "New Comment Published",
        html: htmlString // html: '<h1>New Comment is now published</h1>'
    }, (error,info)=>{
        if(error){
            console.log("Error in sending mail : "+error);
            return;
        }

        // console.log("Message Sent",info);
        return;
    })
}