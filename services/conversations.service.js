const Conversation = require("../models/conversation.model");

module.exports = {
    async createConversation(req, res) {
        try {

            const conversation = await Conversation.create({
                members: [req.body.mainUser, req.body.otherUser],
            });

            const response = await conversation.populate("members", "userName profilePicture");

            res.status(200).send(response);
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    },
    async getUserConversations(req, res) {
        try {
            const conversation = await Conversation
                .find({ members: { $in: [req.user._id] } })
                .populate("members", "userName profilePicture");
            res.status(200).send(conversation);
        } catch (err) {
            res.status(500).send(err);
        }
    }
}