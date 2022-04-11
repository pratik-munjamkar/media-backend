const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        minlength: 4,
        maxlength: 50,
        required: true,
        trim: true
    },
    userName: {
        type: String,
        minlength: 3,
        maxlength: 12,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        maxlength: 50,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        minlength: 6,
        maxlength: 250,
        required: true,
        trim: true
    },
    profilePicture: {
        type: String,
        default: process.env.DEFAULT_PROFILE_PIC,
        trim: true
    },
    profilePictureId: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        maxlength: 50,
        default: "",
        trim: true
    },
    followers: [{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }],
    following: [{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }],
});

module.exports = mongoose.model("User", UserSchema, "users");