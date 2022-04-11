const Comment = require("../models/comment.model");
const Post = require("../models/post.model");


module.exports = {

    async AddComment(req, res) {

        try {
            const { commentText } = req.body;

            const comment = await Comment.create({
                comment: commentText,
                ofPost: req.params.postid,
                commentBy: req.user._id
            });

            await Post.findOneAndUpdate({
                _id: req.params.postid
            }, {
                $push: { comments: comment._id }
            });

            res.send(comment);
        }
        catch (err) {
            console.log(err);
            res.status(500).send("Couldnt post comment");
        }

    },
    async DeleteComment(req, res) {
        try {

            await Comment.findByIdAndDelete(req.params.commentid);

            await Post.findOneAndUpdate({ _id: req.params.postid },
                {
                    $pull: { comments: req.params.commentid }
                }
            );

            res.send("Comment deleted successfully");
        }
        catch (err) {
            console.log(err);
            res.status(500).send("Couldnt delete comment");

        }

    }
}