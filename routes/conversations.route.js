const router = require("express").Router();
const ConversationServices = require("../services/conversations.service");

//new conv
router.post("/", ConversationServices.createConversation);

//get all conversations
router.get("/", ConversationServices.getUserConversations);

module.exports = router;