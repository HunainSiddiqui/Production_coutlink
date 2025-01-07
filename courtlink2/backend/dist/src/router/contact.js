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
const express_1 = require("express");
const db_1 = require("../db");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
// GET route to fetch appointment requests for the lawyer
router.get("/requests", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        return res.status(400).json({
            message: "User ID is required to fetch appointment requests.",
        });
    }
    try {
        // Find the lawyer's record based on userId
        const lawyer = yield db_1.prismaClient.lawyer.findUnique({
            where: { userId },
        });
        if (!lawyer) {
            return res.status(404).json({
                message: "Lawyer record not found.",
            });
        }
        // Fetch the contact requests assigned to the lawyer
        const requests = yield db_1.prismaClient.contactRequest.findMany({
            where: { lawyerId: lawyer.id },
        });
        return res.status(200).json({
            message: "Appointment requests fetched successfully.",
            requests,
        });
    }
    catch (error) {
        // console.error("Error fetching appointment requests:", error.message);
        return res.status(500).json({
            message: "An error occurred while fetching appointment requests.",
        });
    }
}));
// PUT route to accept or reject the request
router.put("/respond-request", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { requestId, status } = req.body; // Status can be "Accepted" or "Rejected"
    if (!requestId || !status) {
        return res.status(400).json({
            message: "Request ID and status are required.",
        });
    }
    try {
        const contactRequest = yield db_1.prismaClient.contactRequest.update({
            where: { id: requestId },
            data: { status },
        });
        return res.status(200).json({
            message: "Request status updated successfully.",
            contactRequest,
        });
    }
    catch (error) {
        // console.error("Error updating request status:", error.message);
        return res.status(500).json({
            message: "An error occurred while updating the request status.",
        });
    }
}));
exports.default = router;
