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
exports.userRouter = void 0;
const express_1 = require("express");
const middleware_1 = require("../middleware");
const types_1 = require("../types");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../db");
const router = (0, express_1.Router)();
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const parsedData = types_1.SignupSchema.safeParse(body);
    console.log(parsedData);
    if (!parsedData.success) {
        return res.status(411).json({
            message: "Incorrect inputs. Please check again.",
            details: parsedData.error.errors
        });
    }
    const userExists = yield db_1.prismaClient.user.findFirst({
        where: {
            email: parsedData.data.email,
        },
    });
    if (userExists) {
        return res.status(403).json({
            message: "User Already Exists",
        });
    }
    yield db_1.prismaClient.user.create({
        data: {
            fullname: parsedData.data.fullname,
            email: parsedData.data.email,
            password: yield bcryptjs_1.default.hash(parsedData.data.password, 10),
            role: parsedData.data.role,
        },
    });
    return res.json({
        message: "Please verify your account by clicking on the link in your email.",
    });
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    console.log(body);
    const parsedData = types_1.SigninSchema.safeParse(body);
    console.log(parsedData);
    if (!parsedData.success) {
        return res.status(411).json({
            message: "The entered details are incorrect. Please verify them again.",
        });
    }
    const user = yield db_1.prismaClient.user.findFirst({
        where: { email: parsedData.data.email },
    });
    if (!user ||
        !(yield bcryptjs_1.default.compare(parsedData.data.password, user.password))) {
        return res.status(403).json({
            message: "Sorry, the entered credentials are incorrect.",
        });
    }
    // Sign in the JWT Token
    const token = jsonwebtoken_1.default.sign({ id: user.id }, config_1.JWT_PASSWORD);
    return res.json({
        token: token,
    });
}));
router.get("/me", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // @ts-ignore
    const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const user = yield db_1.prismaClient.user.findFirst({
        where: { id },
        select: {
            fullname: true,
            email: true,
            role: true,
            id: true,
            // @ts-ignore
            isformfilled: true,
        },
    });
    return res.json({
        user,
    });
}));
//Logout
router.post("/logout", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.json({
        message: "Logged out",
    });
}));
exports.userRouter = router;
