const route = require("express").Router();
const Authservices = require("../services/auth.service");

// Register
route.post("/register", Authservices.Register);

// Login
route.post("/login", Authservices.Login);

// Forgot Password
route.put("/forgotpassword", Authservices.ForgotPassword);

// Reset Password
route.put("/resetpassword", Authservices.ResetPassword);

module.exports = route;