const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");

const UsersRoute = require("./routes/users.route");
const AuthRoute = require("./routes/auth.route");
const PostsRoute = require("./routes/posts.route");
const CommentsRoute = require("./routes/comment.route");
const ConversationRoute = require("./routes/conversations.route");
const MessageRoute = require("./routes/messages.route");
const verifyJWT = require("./services/verifyJWT");

const { createServer } = require("http");
const { Server } = require("socket.io");

dotenv.config();

// Connecting to mongoDb Atlas

mongoose.connect(process.env.MONGO_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

console.log("connected to mongo");

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: { origin: process.env.FRONTEND }
});

let users = [];

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {

    //when a user connects
    console.log("a user connected");

    //take userId and socketId from user
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
    });

    //send and get message
    socket.on("sendMessage", ({ sender, receiverId, text }) => {
        const user = getUser(receiverId);
        io.to(user?.socketId).emit("getMessage", {
            sender,
            text,
        });
    });

    //when user disconnects
    socket.on("disconnect", () => {
        console.log("a user disconnected!");
        removeUser(socket.id);
    });

});

// Middlewares

app.use(cors({
    origin: process.env.FRONTEND
}));

app.use(express.json());

app.use(helmet());

app.use(morgan("common"));

app.use("/auth", AuthRoute);

app.use(verifyJWT);

app.use("/users", UsersRoute);

app.use("/posts", PostsRoute);

app.use("/comments", CommentsRoute);

app.use("/conversations", ConversationRoute);

app.use("/messages", MessageRoute);

httpServer.listen(process.env.PORT || 3001, () => console.log("server running"));