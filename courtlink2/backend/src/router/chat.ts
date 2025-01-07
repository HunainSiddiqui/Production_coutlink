import e, { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware";
import { prismaClient } from "../db";
import bcrypt from "bcryptjs";

export function chatRouter(io: any) {
  const router = Router();

  // 1. Create a new one-to-one chat
  router.post("/create", authMiddleware, async (req: Request, res: Response) => {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required to create a chat." });
    }

    try {
        // @ts-ignore
      const myUserId = req.user?.id;

      const existingChat = await prismaClient.chat.findFirst({
        where: {
          OR: [
            { user1Id: myUserId, user2Id: userId },
            { user1Id: userId, user2Id: myUserId },
          ],
        },
      });

      if (existingChat) {
        return res.status(200).json({ chat: existingChat });
      }
      
      

      const chat = await prismaClient.chat.create({
        data: {
          user1Id: myUserId,
          user2Id: userId,
        },
      });


      return res.status(201).json({ chat });
    } catch (error) {
      console.error("Error creating chat:", error);
      return res.status(500).json({ message: "Failed to create chat." });
    }
  });

  // Fetch all chats for the authenticated user
  router.get("/my-chats", authMiddleware, async (req: Request, res: Response) => {
    try {
      // @ts-ignore
      const userId = req.user?.id;
  
      const chats = await prismaClient.chat.findMany({
        where: {
          OR: [
            { user1Id: userId },
            { user2Id: userId },
          ],
        },
        include: {
          user1: true, // Fetch user1's information
          user2: true, // Fetch user2's information
        },
      });
  
      // Map chats to include the names dynamically
      const formattedChats = chats.map((chat:any) => ({
        id: chat.id,
        user1Id: chat.user1Id,
        user2Id: chat.user2Id,
        user1Name: chat.user1.fullname,
        user2Name: chat.user2.fullname,
      }));
  
      return res.status(200).json({ chats: formattedChats });
    } catch (error) {
      console.error("Error fetching chats:", error);
      return res.status(500).json({ message: "Failed to fetch chats." });
    }
  });
  

  // Send a chat message
  router.post("/send-message", authMiddleware, async (req: Request, res: Response) => {
    const { chatId, content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Message content cannot be empty." });
    }

    try {
        // @ts-ignore
      const senderId = req.user?.id;

      const message = await prismaClient.message.create({
        data: {
          senderId,
          chatId,
          content,
        },include: {
          sender: true,  // Include sender details
          chat: {
            include: {
              user1: true,  // Include details of user1 (first participant in the chat)
            },
          },
        },
      });

      
      return res.status(201).json({ message });
    } catch (error) {
      console.error("Error sending message:", error);
      return res.status(500).json({ message: "Failed to send message." });
    }
  });

  router.get("/messages/:chatId", authMiddleware, async (req: Request, res: Response) => {
    const { chatId } = req.params;

    try {
      const messages = await prismaClient.message.findMany({
        where: {
          chatId: parseInt(chatId),
        },
        orderBy: {
          createdAt: "asc", // Ensures that messages are ordered chronologically
        },
      });

      return res.status(200).json({ messages });
    } catch (error) {
      console.error("Error fetching messages:", error);
      return res.status(500).json({ message: "Failed to load messages." });
    }
  });

  return router;
}
