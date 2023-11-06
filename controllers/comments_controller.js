// I can add async await and try catch statments here as well in the controllers to avoid call back hell

const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailer');
const comment_email_worker = require('../workers/comment_email_worker');
const queue = require('../config/kue');
const Like = require('../models/like')


module.exports.create = async function(request,response){

    try{

        let post = await Post.findById(request.body.post);

        if(post){
            let comment = await Comment.create({
                content: request.body.comment,
                post: request.body.post,
                user:request.user._id
            })
            
            post.comments.push(comment);
            post.save();

            // Similar for comments to fetch the user's id!
            comment = await comment.populate('user','name email');
            console.log(comment.populated());

            // commentsMailer.newComment(comment);
            let job = queue.create('emails',comment).save(function(error){
                if(error){
                    console.log("Error in sending to the queue!!",error)
                    return;
                }
                console.log("Job Enqueued",job.id);
            })

            if (request.xhr){
                return response.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Post created!"
                });
            }
        }

        request.flash('success','Comment created');
        return response.redirect('/');

    }catch(error){
        request.flash('error','Comment creation failed');
        return;
    }
}

module.exports.destroy = function(request,response){
    Comment.findById(request.params.id)
    .then(async (comment)=>{
        if(comment.user._id == request.user.id){
            let postId = comment.post._id;

            await Comment.findByIdAndDelete(request.params.id);

            await Like.deleteMany({likeable: comment._id, onModel:'Comment'})

            await Post.findByIdAndUpdate(postId,{$pull:{comments : request.params.id}})
            .then((post)=>{

                if (request.xhr){
                    return response.status(200).json({
                        data: {
                            comment_id: request.params.id
                        },
                        message: "Post deleted"
                    });
                }

                request.flash('success','Comment deleted succesfully');
                return response.redirect('back');
            })
            .catch((error)=>{
                request.flash('error','Comment not deleted');
                return response.redirect('back');
            })
        }
        else{
            let postId = comment.post._id;

            await Comment.findByIdAndDelete(request.params.id);

            await Post.findByIdAndUpdate(postId,{$pull:{comments : request.params.id}})
            .then((post)=>{

                if (request.xhr){
                    return response.status(200).json({
                        data: {
                            comment_id: request.params.id
                        },
                        message: "Post deleted"
                    });
                }

                request.flash('success','Comment deleted succesfully');
                return response.redirect('back');
            })
            .catch((error)=>{
                request.flash('error','Comment not deleted');
                return response.redirect('back');
            })

            
        }
    })
}