import express from 'express';
import cors from 'cors';
const cookieParser = require('cookie-parser');
import {userRouter} from './router/user';
import { bailRouter } from './router/bail';
import { prisonRouter } from './router/prisoner';
import { lawyerRouter } from './router/lawyer';
// import { caseRouter } from './router/case';
import { resetPasswordRouter } from './router/reset-password';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { chatRouter } from './router/chat';
import { addinfo } from './router/addinfo';


const app = express();
app.use(express.json());
app.use(cookieParser()); 
app.use(cors());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/bail", bailRouter);
app.use("/api/v1/forms", prisonRouter);
app.use("/api/v1/forms", lawyerRouter);
app.use("/api/v1/forms", addinfo);
// app.use("/api/v1/cases", caseRouter);
app.use("/api/v1", resetPasswordRouter);
app.use("/api/v1/lawyer",lawyerRouter)
app.use("/api/v1/prisoner",prisonRouter)


const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
    }
});

app.use("/api/v1/chat", chatRouter(io)); // Pass io to routes here

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
  
      if (!chat.user2Id && chat.user2Id != newMessageRecieved.senderId) return console.log("chat user 2 not defined");
      if (!chat.user1Id && chat.user1Id != newMessageRecieved.senderId) return console.log("chat user 1 not defined");

      if(chat.user1Id != newMessageRecieved.senderId)
      {
        socket.in(chat.user1Id).emit("message recieved", newMessageRecieved);
      }
      if(chat.user2Id != newMessageRecieved.senderId)
      {
        socket.in(chat.user2Id).emit("message recieved", newMessageRecieved);
      }
  
      if (!chat.user1Id && chat.user1Id != newMessageRecieved.senderId) return console.log("chat user 2 not defined");
      
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