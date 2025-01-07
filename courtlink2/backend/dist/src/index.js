"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookieParser = require('cookie-parser');
const user_1 = require("./router/user");
const bail_1 = require("./router/bail");
const prisoner_1 = require("./router/prisoner");
const lawyer_1 = require("./router/lawyer");
// import { caseRouter } from './router/case';
const reset_password_1 = require("./router/reset-password");
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const chat_1 = require("./router/chat");
const addinfo_1 = require("./router/addinfo");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(cookieParser());
app.use((0, cors_1.default)());
app.use("/api/v1/user", user_1.userRouter);
app.use("/api/v1/bail", bail_1.bailRouter);
app.use("/api/v1/forms", prisoner_1.prisonRouter);
app.use("/api/v1/forms", lawyer_1.lawyerRouter);
app.use("/api/v1/forms", addinfo_1.addinfo);
// app.use("/api/v1/cases", caseRouter);
app.use("/api/v1", reset_password_1.resetPasswordRouter);
app.use("/api/v1/lawyer", lawyer_1.lawyerRouter);
app.use("/api/v1/prisoner", prisoner_1.prisonRouter);
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: '*',
    }
});
app.use("/api/v1/chat", (0, chat_1.chatRouter)(io)); // Pass io to routes here
io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
        socket.join(userData.id);
        socket.emit("connected");
    });
    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });
    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
        if (!chat.user2Id && chat.user2Id != newMessageRecieved.senderId)
            return console.log("chat user 2 not defined");
        if (!chat.user1Id && chat.user1Id != newMessageRecieved.senderId)
            return console.log("chat user 1 not defined");
        if (chat.user1Id != newMessageRecieved.senderId) {
            socket.in(chat.user1Id).emit("message recieved", newMessageRecieved);
        }
        if (chat.user2Id != newMessageRecieved.senderId) {
            socket.in(chat.user2Id).emit("message recieved", newMessageRecieved);
        }
        if (!chat.user1Id && chat.user1Id != newMessageRecieved.senderId)
            return console.log("chat user 2 not defined");
    });
    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        //@ts-ignore
        socket.leave(userData.id);
    });
});
httpServer.listen(3000, () => {
    console.log("Server is running on port 3000");
});
