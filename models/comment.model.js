const mongoose = require("mongoose");


const commentsSchema = new mongoose.Schema({
    comment: {
        type: String,
        maxlength: 100,
        required: true,
        trim: true
    },
    commentBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    ofPost: {
        type: mongoose.Schema.ObjectId,
        ref: "Post",
        required: true
    }

}, { timestamps: true });


module.exports = mongoose.model("Comment", commentsSchema, "comments");