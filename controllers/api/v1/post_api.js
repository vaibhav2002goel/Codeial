const { json } = require('express');
const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function(request,response){

    let posts = await Post.find({})
    .sort('-createdAt')
    .populate('user')
    .populate({
        path:'comments',
        populate:{
            path:'user'
        }
    });

    // for(var i = 0; i < posts.length; i++) {

    //     delete posts[i]['user']['password'];
    // }

    
    return response.status(200).json({
        message: "List of Posts",
        posts: posts
    }
    
    )
}

module.exports.destroy = async function(request,response){

    try{
         let post = await Post.findById(request.params.id);
         // .id means converting the object id into string
         if(post.user._id == request.user.id){
              await Post.findByIdAndDelete(request.params.id);

              await Comment.deleteMany({post: request.params.id})

            return response.status(200).json({
                message: "Post and associated comments deleted successfully"
            })
              
         }
         else{
            return response.status(401).json({
                message: "You cannot delete this post"
            })
            
         }
    }
    catch(error){

        return response.json(500,{
            message: "Internal Server Error"
        })
    }

}