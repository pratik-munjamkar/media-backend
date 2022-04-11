const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
    {
        conversationId: {
            type: mongoose.Schema.ObjectId
        },
        sender: {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        },
        text: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);