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
exports.addinfo = void 0;
const express_1 = require("express");
const db_1 = require("../db");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
router.post("/undertrial", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const body = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        return res.status(400).json({
            message: "User ID is required to add undertrial information.",
        });
    }
    let prisonerId = yield db_1.prismaClient.prisoner.findFirst({
        where: {
            userId: userId,
        },
    });
    if (!prisonerId) {
        return res.status(400).json({
            message: "Prisoner ID is required to contact a lawyer.",
        });
    }
    const { caseDescription, urgencyLevel, contactNo, lawyerId } = req.body;
    // console.log(req.body);
    console.log(prisonerId);
    if (!caseDescription || !lawyerId || !contactNo) {
        return res.status(400).json({
            message: "Please provide case description or  contact number.",
        });
    }
    const lid = parseInt(lawyerId);
    try {
        const contactRequest = yield db_1.prismaClient.contactRequest.create({
            // @ts-ignore
            data: {
                prisonerId: prisonerId.id,
                lawyerId: lid,
                status: "Pending",
                caseDescription: caseDescription,
                urgencyLevel: urgencyLevel,
                contactNo: contactNo,
            },
        });
        return res.status(201).json({
            message: "Contact request submitted successfully!",
            contactRequest,
        });
    }
    catch (err) {
        //@ts-ignore
        console.error("Error submitting contact request:", err.message);
        return res.status(500).json({
            message: "An error occurred while submitting the contact request.",
        });
    }
}));
exports.addinfo = router;
