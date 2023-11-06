const Like = require('../models/like');
const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.toggleLike = async function(request,response){
    try{
        let likeable;
        let deleted = false;

        if(request.query.type=='Post'){
            likeable = await Post.findById(request.query.id).populate('likes');
        }else{
            likeable = await Comment.findById(request.query.id).populate('likes');
        }

        let existingLike = await Like.findOne({
            likeable: request.query.id,
            onModel: request.query.type,
            user: request.user._id
        })

        if(existingLike){
            likeable.likes.pull(existingLike._id)
            likeable.save();

            // existingLike.remove();
            await Like.findByIdAndDelete(existingLike._id);
            deleted = true;
        }
        else{
            let newLike = await Like.create({
                user: request.user._id,
                likeable: request.query.id,
                onModel: request.query.type
            })

            likeable.likes.push(newLike._id);
            likeable.save()
        }

        return response.status(200).json({
            message:"Request Successful",
            data: {
                deleted: deleted
            }
        })

    }catch(error){
        console.log(error);
        return response.status(500).json({
            message:'Internal Server Error'
        })
    }
}