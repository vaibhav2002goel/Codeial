const mongoose = require('mongoose');

const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars')

const userSchema = new mongoose.Schema({
    email:{
        type : String,
        required : true,
        unique : true
    },

    password:{
        type:String,
        required:true
    },

    name:{
        type: String,
        required: true
    },

    // This is where we will store the path of the file in the database
    avatar:{ 
        type:String
    }

},{
    timestamps : true
});

let storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,path.join(__dirname,'..',AVATAR_PATH));
    },
    filename: function(req,file,cb){
        cb(null,file.fieldname + '-' + Date.now());
    }
});

// static method
userSchema.statics.uploadedAvatar = multer({storage:storage}).single('avatar');
userSchema.statics.avatarPath = AVATAR_PATH 



const User = mongoose.model("User",userSchema);

module.exports = User;