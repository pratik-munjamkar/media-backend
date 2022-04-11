const route = require("express").Router();
const UserServices = require("../services/user.service");

// get all users for suggestion
route.get("/suggestions", UserServices.GetSuggestions);

//get user profile
route.get("/profile", UserServices.GetProfile);

//update user picture
route.put("/editpic", UserServices.EditPicture);

//update user
route.put("/edit", UserServices.EditUser);

//delete user
route.delete("/delete", UserServices.DeleteUser);

//follow user
route.put("/follow/:id", UserServices.FollowUser);

//unfollow user
route.put("/unfollow/:id", UserServices.UnfollowUser);

//remove user from our followers
route.put("/remove/:id", UserServices.RemoveUser);

//get following list
route.get("/following/:id", UserServices.GetFollowing);

//get followers list
route.get("/followers/:id", UserServices.GetFollowers);

module.exports = route;