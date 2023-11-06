// module.exports.actionName = function(request,response){}

const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(request,response){
    
    // console.log(request.cookies);
    // response.cookie('user_id',456);
    
    // Post.find({})
    // .then((posts)=>{
    //     return response.render('home',{
    //         title : "Codial | Home",
    //         posts : posts
    //     })
    // })
    // .catch((error)=>{
    //     console.log("Error!!");
    // })

    try{
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path:'comments',
            populate:{
                path:'user'
            },
            populate: {
                path: 'likes'
            }
        }).populate('comments')
        .populate('likes');

        let user = await User.find({});

        return response.render('home',{
            title : "Codial | Home",
            posts : posts,
            all_users : user
        });
    }
    catch(error){
        console.log("Error : "+error);
        return;
    }
}

module.exports.settings = function(request,reponse){
    return reponse.end(`<h1> Open Settings </h1>`)
}