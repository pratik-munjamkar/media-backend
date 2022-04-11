const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema({
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    photo: {
        type: String,
        required: true,
    },
    photoId: {
        type: String,
        required: true,
    },
    caption: {
        type: String,
        trim: true,
        maxlength: 100
    },
    likes: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        }
    ],
    comments: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Comment"
        }
    ],
    location: {
        type: String,
        trim: true,
        maxlength: 30
    }
}, { timestamps: true });

module.exports = mongoose.model("Post", postsSchema, "posts");