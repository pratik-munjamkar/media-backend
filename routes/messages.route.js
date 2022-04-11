const router = require("express").Router();
const messagesServices = require("../services/messages.service");
//create new message
router.post("/", messagesServices.createMessage);

//get messages of a conversation
router.get("/:conversationId", messagesServices.getMessages);

module.exports = router;