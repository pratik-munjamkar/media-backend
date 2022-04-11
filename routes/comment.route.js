const route = require("express").Router();
const CommentServices = require("../services/comment.service");

//add a comment
route.post("/add/:postid", CommentServices.AddComment);

//delete a comment
route.delete("/delete/:postid/:commentid", CommentServices.DeleteComment);

module.exports = route;