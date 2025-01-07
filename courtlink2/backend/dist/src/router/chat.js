"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRouter = chatRouter;
const express_1 = require("express");
const middleware_1 = require("../middleware");
const db_1 = require("../db");
function chatRouter(io) {
    const router = (0, express_1.Router)();
    // 1. Create a new one-to-one chat
    router.post("/create", middleware_1.authMiddleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required to create a chat." });
        }
        try {
            // @ts-ignore
            const myUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const existingChat = yield db_1.prismaClient.chat.findFirst({
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
            const chat = yield db_1.prismaClient.chat.create({
                data: {
                    user1Id: myUserId,
                    user2Id: userId,
                },
            });
            return res.status(201).json({ chat });
        }
        catch (error) {
            console.error("Error creating chat:", error);
            return res.status(500).json({ message: "Failed to create chat." });
        }
    }));
    // Fetch all chats for the authenticated user
    router.get("/my-chats", middleware_1.authMiddleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            // @ts-ignore
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const chats = yield db_1.prismaClient.chat.findMany({
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
            const formattedChats = chats.map((chat) => ({
                id: chat.id,
                user1Id: chat.user1Id,
                user2Id: chat.user2Id,
                user1Name: chat.user1.fullname,
                user2Name: chat.user2.fullname,
            }));
            return res.status(200).json({ chats: formattedChats });
        }
        catch (error) {
            console.error("Error fetching chats:", error);
            return res.status(500).json({ message: "Failed to fetch chats." });
        }
    }));
    // Send a chat message
    router.post("/send-message", middleware_1.authMiddleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        const { chatId, content } = req.body;
        if (!content) {
            return res.status(400).json({ message: "Message content cannot be empty." });
        }
        try {
            // @ts-ignore
            const senderId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const message = yield db_1.prismaClient.message.create({
                data: {
                    senderId,
                    chatId,
                    content,
                }, include: {
                    sender: true, // Include sender details
                    chat: {
                        include: {
                            user1: true, // Include details of user1 (first participant in the chat)
                        },
                    },
                },
            });
            return res.status(201).json({ message });
        }
        catch (error) {
            console.error("Error sending message:", error);
            return res.status(500).json({ message: "Failed to send message." });
        }
    }));
    router.get("/messages/:chatId", middleware_1.authMiddleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { chatId } = req.params;
        try {
            const messages = yield db_1.prismaClient.message.findMany({
                where: {
                    chatId: parseInt(chatId),
                },
                orderBy: {
                    createdAt: "asc", // Ensures that messages are ordered chronologically
                },
            });
            return res.status(200).json({ messages });
        }
        catch (error) {
            console.error("Error fetching messages:", error);
            return res.status(500).json({ message: "Failed to load messages." });
        }
    }));
    return router;
}
