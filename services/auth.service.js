const User = require("../models/user.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../utils/transporter");

module.exports = {

    async Register(req, res) {

        try {

            const { fullName, userName, email, password } = req.body;

            // Checking if user already exists
            const userExists = await User.findOne({ email });
            if (userExists) return res.status(409).send("this email is already registered");

            // Checking if userName already exists
            const usernameExists = await User.findOne({ userName });
            if (usernameExists) return res.status(409).send("this username already exists!");

            //Encoding password
            const encodedPassword = await bcryptjs.hash(password, 10);

            // Creating new user
            const user = await User.create({
                fullName,
                userName,
                email,
                password: encodedPassword
            });

            res.status(200).send(user);

        } catch (err) {
            console.log(err);
            res.status(500).send("error registering user. Try after some time");
        }
    }
    ,
    async Login(req, res) {

        try {

            const { email, password } = req.body;

            // Checking if user exists
            const user = await User.findOne({ email });
            if (!user) return res.status(404).send("user not found/ Wrong email");

            // Checking if password is matching
            const validPass = await bcryptjs.compare(password, user.password);
            if (!validPass) return res.status(403).send("wrong password");

            // generating jwt token
            const token = jwt.sign({ user }, process.env.JWT_SECRET);

            const { password: pass, ...other } = user._doc;

            res.send({
                "userinfo": other,
                "token": token
            });

        } catch (err) {
            res.status(500).send("Error logging in. Try after some time");
        }

    },


    async ForgotPassword(req, res) {
        try {

            const { email } = req.body;
            const emailToken = jwt.sign(
                {
                    user: email,
                },
                process.env.JWT_SECRET
            );

            // Checking if user exists
            const user = await User.findOne({ email });
            if (!user) return res.status(404).send("user not found/ Wrong email");

            // If user exists save token as password
            await User.findOneAndUpdate({ _id: user._id },
                { $set: { password: emailToken } });

            const url = `${process.env.FRONTEND}/user/resetpassword/${emailToken}`;

            // send email verification mail
            await transporter.sendMail({
                to: email,
                subject: 'Password reset form',
                html: `Please click this link to reset your password: <a href="${url}">${url}</a>`,
            });

            res.send("sent reset password email");

        }
        catch (err) {
            console.log(err)
            res.status(500).send("Error sending mail. try later");
        }

    },

    async ResetPassword(req, res) {
        try {

            const { password: plainPassword, randomString } = req.body;

            // Checking if jwt is valid
            jwt.verify(randomString, process.env.JWT_SECRET);

            //Encoding password
            const encryptedPassword = await bcryptjs.hash(plainPassword, 10);

            //if randomstring from client side is same as password in db change password
            await User.findOneAndUpdate({ password: randomString },
                { $set: { password: encryptedPassword } });

            res.send("password updated successfully!");

        }
        catch (err) {
            console.log(err)
            res.status(500).send("error resetting password");
        }

    }



}