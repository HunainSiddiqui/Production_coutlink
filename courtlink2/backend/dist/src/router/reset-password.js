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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordRouter = void 0;
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const db_1 = require("../db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const sendEmail = require("./sendemail");
const router = (0, express_1.Router)();
var Randomopt = 0;
var created_time = new Date();
router.post("/forgotpassword", 
// @ts-ignore
(0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Email field is required",
        });
    }
    try {
        // Find user by email
        const userAvailable = yield db_1.prismaClient.user.findUnique({
            where: { email },
        });
        if (!userAvailable) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        Randomopt = Math.floor(10000 + Math.random() * 90000);
        created_time = new Date();
        const message = `Your OTP is ${Randomopt} \n\nIf you have not requested this email then, please ignore it.`;
        try {
            yield sendEmail({
                email: userAvailable.email,
                subject: `CourtLink Password Recovery`,
                message,
            });
            res.status(200).json({
                success: true,
                message: `Email sent to ${userAvailable.email} successfully`,
            });
        }
        catch (error) {
            console.error("Email could not be sent", error);
            return res.status(500).json({ success: false, message: "Email could not be sent" });
        }
    }
    catch (error) {
        return next(error); // Pass error to the global error handler
    }
})));
router.post("/resetpassword", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp, password, confirmpassword } = req.body;
    if (!email || !otp || !password || !confirmpassword) {
        return res.status(400).json({
            success: false,
            message: "Email, OTP and Password fields are required",
        });
    }
    if (password !== confirmpassword) {
        return res.status(400).json({
            success: false,
            message: "Password and Confirm Password do not match",
        });
    }
    try {
        const userAvailable = yield db_1.prismaClient.user.findUnique({
            where: { email },
        });
        if (!userAvailable) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        if (otp !== Randomopt && new Date().getTime() - created_time.getTime() > 300000) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP or expired",
            });
        }
        //encrypt password
        const newpassword = yield bcryptjs_1.default.hash(password, 10);
        const updatedUser = yield db_1.prismaClient.user.update({
            where: { email },
            data: {
                password: newpassword,
            },
        });
        res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Password could not be updated" });
    }
}));
exports.resetPasswordRouter = router;
