const Post = require('../models/post')
const Comment = require('../models/comment');
const Like = require('../models/like')

module.exports.create = async function(request,response){
       
     try{
          let post = await Post.create({
             content: request.body.content,
             user : request.user._id //This user on the right side is being accesed using the setAuthenticatedUser function in the passport-local-strategy configuration
          });

          if(request.xhr){
               // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
               post = await post.populate('user', 'name');

               return response.status(200).json({
                    data: {
                         post:post
                    },
                    message:"Post Created"
               })
          }


          request.flash('success','Post published');

          return response.redirect('back');
     }
     catch(error){
          request.flash('error',error);
          return response.redirect('back') ;
     }
       
}

module.exports.destroy = async function(request,response){

     try{
          let post = await Post.findById(request.params.id);
          // .id means converting the object id into string
          if(post.user._id == request.user.id){

               await Like.deleteMany({likeable: post, onModel: 'Post'});
               await Like.deleteMany({_id: {$in:post.comments}});

               await Post.findByIdAndDelete(request.params.id);

               await Comment.deleteMany({post: request.params.id})

               if(request.xhr){
                    return response.status(200).json({
                         data:{
                              post_id : request.params.id
                         },
                         message: "Post deleted"
                    })
               }
               
               request.flash('success','Post and associated comments deleted');

               return response.redirect('back');
          }
          else{

               request.flash('error','You cannot delete the post')

               return response.redirect('back');
          }
     }
     catch(error){
          request.flash('error',error);
          return response.redirect('back') ;
     }

}