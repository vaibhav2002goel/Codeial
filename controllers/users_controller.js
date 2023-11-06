
const User = require('../models/user');
const fs = require('fs');
const path = require('path');

module.exports.profile = function(request,response){

    User.findById(request.params.id)
    .then((user)=>{
        return response.render('user_profile',{
            title:"User profile",
            profile_user:user
        });
        
    })
}

module.exports.update = async function(request,response){
    // if(request.user.id == request.params.id){
    //     User.findByIdAndUpdate(request.params.id,request.body)
    //     .then((user)=>{
    //         return response.redirect('back');
    //     })
    //     .catch((error)=>{
    //         console.log('back');
    //     })
    // }
    // else{
    //     return response.status(401).send('Unauthorized');
    // }

    if(request.user.id == request.params.id){
        
        try{
            let user = await User.findById(request.params.id);
            User.uploadedAvatar(request,response,function(error){
                if(error){
                    console.log('Multer Error',error);
                }
                
                user.name = request.body.name;
                user.email = request.body.email;

                if(request.file){

                    if(user.avatar){
                        if(fs.existsSync(path.join(__dirname,'..',user.avatar))){
                            fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                        }
                    }

                    //this is saving the path of the uploaded file into avatar field in the user
                    user.avatar = User.avatarPath + '/' + request.file.filename;
                }

                user.save();

                return response.redirect('back');

            })
        }
        catch(error){
            request.flash('error',error);
            return response.redirect('back');
        }
    }
    else{
        return response.status(401).send('Unauthorized');
    }


}

module.exports.bio = function(request,response){
    return response.end('<h1> This is your bio </h1>')
}

//Render sign up pages
module.exports.signUp = function(request,response){

     if(request.isAuthenticated()){
       return response.redirect('/users/profile')
     }

    return response.render('user_sign_up' , {
        title: "Codial | Sign Up"
    })
}

//Render Sign in page
module.exports.signIn = function(request,response){

    if(request.isAuthenticated()){
        return response.redirect('/users/profile')
     }

    return response.render('user_sign_in' , {
        title: "Codial | Sign In"
    })
}

//Get the sign up data
module.exports.create = function(request,response){
    if( request.body.password != request.body.confirm_password ){
        request.flash('error','Password does not match');
        return response.redirect('back');
    }
    // The findOne() function is used to find one document according to the condition. If multiple documents 
    // match the condition, then it returns the first document satisfying the condition. 
    User.findOne({email: request.body.email})
    .then((user)=>{
        if(!user){
            User.create(request.body)
            .then((user)=>{
                request.flash('success','User Created Successfully');
                return response.redirect('/users/sign-in');
            })
            .catch((error)=>{
                request.flash('error','Error occured');
                return response.redirect('back');
            })
        }
        else{
            request.flash('error','User already exists');
            return response.redirect('back');
        }
    })
    .catch((error)=>{
        request.flash('error',error);
        return;
    })

}

//Session
module.exports.createSession = function(request,response){

    request.flash('success','Logged in Successfully');

    return response.redirect('/');
}

module.exports.destroySession = function(request,response){

    
    request.logout(function(error){
        if(error){
            return next(error);
        }
        
        request.flash('success','You have logged out');
        return response.redirect('/');
    });
    
}