require("dotenv").config();
const Post = require("../models/post.model");
const User = require("../models/user.model");
const Comment = require("../models/comment.model");
const cloudinary = require("../utils/cloudinary");

module.exports = {

    async CreatePost(req, res) {
        try {

            const { photo, photoId, caption, location } = req.body;

            await Post.create({
                postedBy: req.user._id,
                photo, photoId, caption, location
            });

            res.send("post created successfully");

        }
        catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    },
    async userPosts(req, res) {
        try {

            const posts = await Post.find({ postedBy: req.user._id });

            res.send(posts);

        }
        catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    },

    async ExplorePosts(req, res) {

        try {

            const posts = await Post.find({ postedBy: { $ne: req.user._id } })
                .populate("postedBy", "userName profilePicture")
                .sort({ "createdAt": -1 });

            res.send(posts);

        }
        catch (err) {
            console.log(err);
            res.status(500).send(err);
        }

    },

    async FeedPosts(req, res) {

        try {
            const user = await User.findOne({ _id: req.user._id }, { following: 1 });
            const ids = [req.user._id, ...user.following];

            const posts = await Post.find({
                postedBy: { $in: ids }
            })
                .populate("postedBy", "userName profilePicture")
                .populate("likes", "userName profilePicture")
                .populate({
                    path: 'comments', select: 'comment commentBy',
                    populate: {
                        path: 'commentBy',
                        select: 'userName'
                    }
                })
                .sort({ "createdAt": -1 });

            res.send(posts);

        }
        catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    },
    async GetPost(req, res) {
        try {
            const post = await Post.findOne({ _id: req.params.id })
                .populate("postedBy", "userName profilePicture")
                .populate("likes", "userName profilePicture")
                .populate({
                    path: 'comments', select: 'comment commentBy',
                    populate: {
                        path: 'commentBy',
                        select: 'userName'
                    }
                });
            res.send(post);
        }
        catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    },

    async DeletePost(req, res) {

        try {

            const post = await Post.findOneAndDelete({ _id: req.params.id });

            //Delete post image from cloud
            await cloudinary.uploader.destroy(post.photoId);

            //Delete all comments of the post
            await Comment.deleteMany({ _id: { $in: post.comments } });

            res.send("post deleted successfully");

        }
        catch (err) {
            console.log(err);
            res.status(500).send(err);
        }

    },

    async UpdatePost(req, res) {

        try {

            const { caption, location } = req.body;

            const post = await Post.findOneAndUpdate({ _id: req.params.id }, {
                $set: { caption, location }
            }, {
                new: true
            })
                .populate("postedBy", "userName profilePicture")
                .populate("likes", "userName profilePicture")
                .populate({
                    path: 'comments', select: 'comment commentBy',
                    populate: {
                        path: 'commentBy',
                        select: 'userName'
                    }
                });

            res.send(post);

        }
        catch (err) {
            console.log(err);
            res.status(500).send(err);
        }

    },
    async LikePost(req, res) {
        try {
            const { isLiked } = req.body;

            if (isLiked) {
                await Post.findOneAndUpdate({ _id: req.params.id }, {
                    $push: { likes: req.user._id }
                });
            }
            else {
                await Post.findOneAndUpdate({ _id: req.params.id }, {
                    $pull: { likes: req.user._id }
                });
            }

            res.send("success");
        }
        catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    }
}
