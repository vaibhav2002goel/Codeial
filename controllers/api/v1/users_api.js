const User = require('../../../models/user');
const jwt = require('jsonwebtoken');
const env = require('../../../config/environment');

module.exports.createSession = async function(request,response){
    
    try{
        let user = await User.findOne({email:request.body.email})

        if(!user || user.password != request.body.password){
            return response.status(422).json({
                message: "Invalid username or password"
            })
        }

        return response.status(200).json({
            message:'Sign in successful, here is your token, please keep it safe',
            data:{
                token: jwt.sign(user.toJSON(),env.jwt_secret,{expiresIn:'600000'}) //It is in milliseconds
            }
        })

    }catch(error){
        console.log(error);
        return response.status(500).json({
            message: "Internal Server Error"
        })
    }
}