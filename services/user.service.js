require("dotenv").config();
const User = require("../models/user.model");
const Post = require("../models/post.model");
const Comment = require("../models/comment.model");
const cloudinary = require("../utils/cloudinary");

module.exports = {
    async DeleteUser(req, res) {

        try {

            const user = await User.findOneAndDelete({ _id: req.user._id });

            //Delete user profile pic from cloud
            if (user.profilePictureId) await cloudinary.uploader.destroy(user.profilePictureId);

            const posts = await Post.find();

            if (posts) {

                const userPosts = await Post.find({ postedBy: user._id });

                //Delete user posts images from cloud and Delete all comments on users posts
                for (const p of userPosts) {

                    await cloudinary.uploader.destroy(p.photoId);

                    await Comment.deleteMany({ _id: { $in: p.comments } });
                }

                //Delete user posts
                await Post.deleteMany({ postedBy: user._id });

                const userComments = await Comment.find({ commentBy: user._id }, { _id: 1 });

                const userCommentsIds = userComments.map(c => c._id);

                // Remove likes and comments from all posts
                for (const p of posts) {
                    await Post.findByIdAndUpdate({ _id: p._id },
                        {
                            $pull: { comments: { $in: userCommentsIds }, likes: user._id }

                        });
                }

                //Delete all user comments
                await Comment.deleteMany({ commentBy: user._id });

            }

            //Remove user from all users followers list
            for (const u of user.following) {
                await User.findByIdAndUpdate({ _id: u },
                    {
                        $pull: { followers: user._id }
                    });

            }

            //Remove user from users followers following list
            for (const u of user.followers) {
                await User.findByIdAndUpdate({ _id: u },
                    {
                        $pull: { following: user._id }
                    });
            }

            res.send("User deleted successfully.");
        }
        catch (err) {
            console.log(err);
            res.status(500).send("Error deleting user");
        }

    },
    async GetProfile(req, res) {
        try {
            const user = await User.findOne({ _id: req.user._id });

            if (!user) return res.status(404).send("user not found");

            const { password, ...other } = user._doc;
            res.send(other);
        }
        catch (err) {
            console.log(err);
            res.status(500).send("couldnt get user");
        }
    },

    async FollowUser(req, res) {

        try {

            //Adding followed user's id in our Following
            await User.findOneAndUpdate({ _id: req.user._id }, {
                $push: { following: req.params.id }
            });

            //Adding our user id in followed users followers
            await User.findOneAndUpdate({ _id: req.params.id }, {
                $push: { followers: req.user._id }
            });

            res.send("follow successfull.");
        }
        catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    },
    async UnfollowUser(req, res) {

        try {
            //Removing unfollowed users id from our Following
            await User.findOneAndUpdate({ _id: req.user._id }, {
                $pull: { following: req.params.id }
            });

            //Removing our user id from unfollowed user's followers
            await User.findOneAndUpdate({ _id: req.params.id }, {
                $pull: { followers: req.user._id }
            });

            res.send("unfollow successfull.");
        }
        catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    },
    async RemoveUser(req, res) {

        try {
            //Removing users id from our Followers
            await User.findOneAndUpdate({ _id: req.user._id }, {
                $pull: { followers: req.params.id }
            });

            //Removing our user id from user's following
            await User.findOneAndUpdate({ _id: req.params.id }, {
                $pull: { following: req.user._id }
            });

            res.send("removed successfull.");
        }
        catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    },
    async GetSuggestions(req, res) {
        try {

            const user = await User.findOne({ _id: req.user._id });

            const suggestions = await User.find({
                $and: [{ _id: { $ne: user._id } }, {
                    _id: { $nin: user.following }
                }]
            });

            const responseData = suggestions?.map(s => {
                const { password, ...other } = s._doc;
                return other;
            });

            res.send(responseData);

        }
        catch (err) {
            console.log(err);
            res.status(500).send(err);
        }

    },

    async EditUser(req, res) {

        try {

            const { fullName, bio, userName } = req.body;

            // Checking if userName already exists
            const user = await User.findOne({ userName });
            if (user && user._id.toString() !== req.user._id) {
                return res.status(409).send("This username is taken by another user! try different username...");
            }

            await User.findOneAndUpdate({ _id: req.user._id },
                { $set: { fullName, bio, userName } });

            res.send("User details edited successfully");

        }
        catch (err) {
            console.log(err)
            res.status(500).send(err);
        }

    },

    async EditPicture(req, res) {

        try {
            const { profilePicture, profilePictureId } = req.body;

            const userInfo = await User.findOneAndUpdate({ _id: req.user._id },
                { $set: { profilePicture, profilePictureId } });

            if (userInfo.profilePictureId.length) {
                //Delete old profile pic from cloud
                await cloudinary.uploader.destroy(userInfo.profilePictureId);
            }

            res.send("Profile pic edited successfully");

        }
        catch (err) {
            console.log(err)
            res.status(500).send(err);
        }

    },

    async GetFollowing(req, res) {

        try {

            const user = await User.findOne({ _id: req.params.id })
                .populate("following", "userName profilePicture");

            res.send(user.following);

        }
        catch (err) {
            console.log(err)
            res.status(500).send(err);
        }
    },
    async GetFollowers(req, res) {

        try {

            const user = await User.findOne({ _id: req.params.id })
                .populate("followers", "userName profilePicture");

            res.send(user.followers);

        }
        catch (err) {
            console.log(err)
            res.status(500).send(err);
        }
    }

}