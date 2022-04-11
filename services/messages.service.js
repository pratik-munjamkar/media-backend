const Message = require("../models/message.model");

module.exports = {
    async createMessage(req, res) {
        try {
            const message = await Message.create({
                conversationId: req.body.conversationId,
                sender: req.body.sender,
                text: req.body.text
            });
            const response = await message.populate("sender", "profilePicture");
            res.status(200).send(response);
        } catch (err) {
            res.status(500).send(err);
            console.log(err);
        }
    },
    async getMessages(req, res) {
        try {
            const messages = await Message
                .find({
                    conversationId: req.params.conversationId,
                })
                .populate("sender", "profilePicture");

            res.status(200).send(messages);
        } catch (err) {
            res.status(500).send(err);
            console.log(err);

        }
    }
}