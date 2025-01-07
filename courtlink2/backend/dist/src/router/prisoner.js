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
exports.prisonRouter = void 0;
const express_1 = require("express");
const db_1 = require("../db");
const middleware_1 = require("../middleware");
const types_1 = require("../types");
const router = (0, express_1.Router)();
// Route to push prisoner data to the database  
router.post("/prisonerform", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const body = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    // Validate input data
    const parsedData = types_1.PrisonerFormSchema.safeParse(body);
    if (!parsedData.success) {
        return res.status(400).json({
            message: "Invalid form inputs. Please check again.",
            errors: parsedData.error.errors.map((err) => ({
                field: err.path.join("."),
                message: err.message,
            })),
        });
    }
    try {
        // Push prisoner data to the database
        const prisoner = yield db_1.prismaClient.prisoner.create({
            // @ts-ignore
            data: {
                name: parsedData.data.name,
                email: parsedData.data.email,
                prisonerId: parsedData.data.prisonerId,
                dateOfBirth: parsedData.data.dateOfBirth,
                prisonLocation: parsedData.data.prisonLocation,
                crime: parsedData.data.crime,
                securityQuestion: parsedData.data.securityQuestion,
                emergencyContact: parsedData.data.emergencyContact,
                inmateStatus: parsedData.data.inmateStatus,
                caseId: parsedData.data.caseId,
                languagePreference: parsedData.data.languagePreference,
                medicalInfo: parsedData.data.medicalInfo,
                additionalInfo: (_b = parsedData.data.additionalInfo) !== null && _b !== void 0 ? _b : "",
                userId: userId,
            },
        });
        try {
            yield db_1.prismaClient.user.update({
                where: {
                    id: userId,
                },
                data: {
                    // @ts-ignore
                    isformfilled: true,
                },
            });
        }
        catch (error) {
            console.error("Error updating user role to lawyer:", error.message, error.stack);
            return res.status(500).json({
                message: "An error occurred while updating user role to lawyer.",
            });
        }
        return res.status(201).json({
            message: "Prisoner data submitted successfully.",
            prisoner,
        });
    }
    catch (error) {
        console.error("Error submitting prisoner data:", error.message, error.stack);
        if (error.code === "P2002") {
            return res.status(409).json({
                message: "Duplicate entry for prisoner ID.",
            });
        }
        return res.status(500).json({
            message: "An error occurred while submitting prisoner data.",
        });
    }
}));
// Route to fetch prisoner data from the database
router.get("/me", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        return res.status(400).json({
            message: "User ID is required to fetch prisoner records.",
        });
    }
    try {
        const prisoner = yield db_1.prismaClient.prisoner.findUnique({
            where: {
                userId,
            },
        });
        return res.json({
            prisoner,
        });
    }
    catch (error) {
        console.error("Error fetching prisoner data:", error.message, error.stack);
        return res.status(500).json({
            message: "An error occurred while fetching prisoner data.",
        });
    }
}));
//  to show all the requests made by the prisoner
router.get('/myrequests', middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        return res.status(400).json({
            message: "User ID is required to fetch prisoner records.",
        });
    }
    try {
        const prisoner = yield db_1.prismaClient.prisoner.findUnique({
            where: {
                userId,
            },
        });
        if (!prisoner) {
            return res.status(404).json({
                message: "User does not exists",
            });
        }
        const myrequests = yield db_1.prismaClient.contactRequest.findMany({
            where: {
                prisonerId: prisoner.id,
            },
            include: {
                // @ts-ignore
                lawyer: true,
            }
        });
        return res.status(200).json({
            message: "Requests fetched successfully",
            myrequests,
        });
    }
    catch (error) {
        console.log("Error fetching requests", error.message, error.stack);
        return res.status(500).json({
            message: "An error occurred while fetching the requests",
        });
    }
}));
//  Route to update the status of the request done by the lawyer
router.patch("/requests/status/:id", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { id } = req.params;
    const { status } = req.body;
    // Validate the status
    const validStatuses = ["Accepted", "Rejected", "Pending"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            message: `Invalid status. Allowed values: ${validStatuses.join(", ")}`,
        });
    }
    try {
        // Fetch the request and ensure it belongs to the prisoner
        const contactRequest = yield db_1.prismaClient.contactRequest.findUnique({
            where: { id: parseInt(id) },
            include: {
                lawyer: true,
            },
        });
        if (!contactRequest || contactRequest.lawyer.userId !== userId) {
            return res.status(404).json({
                message: "Appointment request not found or does not belong to you.",
            });
        }
        // Update the status
        const updatedRequest = yield db_1.prismaClient.contactRequest.update({
            where: { id: parseInt(id) },
            data: { status },
            include: {
                // @ts-ignore
                prisoner: true,
            }
        });
        return res.status(200).json({
            message: "Case status updated successfully.",
            request: updatedRequest,
        });
    }
    catch (error) {
        console.error("Error updating case status:", error.message, error.stack);
        return res.status(500).json({
            message: "An error occurred while updating the case status.",
        });
    }
}));
exports.prisonRouter = router;
