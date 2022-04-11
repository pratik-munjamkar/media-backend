const route = require("express").Router();
const PostServices = require("../services/posts.service");

// create post
route.post("/create", PostServices.CreatePost);

//get user posts 
route.get("/user", PostServices.userPosts);

//get posts for explore
route.get("/explore", PostServices.ExplorePosts);

//get posts for feed
route.get("/feed", PostServices.FeedPosts);

//get a particular post
route.get("/:id", PostServices.GetPost);

//update post
route.put("/update/:id", PostServices.UpdatePost);

//like/unlike post
route.put("/like/:id", PostServices.LikePost);

//delete post
route.delete("/delete/:id", PostServices.DeletePost)

module.exports = route;