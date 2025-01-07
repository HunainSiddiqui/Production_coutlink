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
exports.bailRouter = void 0;
const db_1 = require("../db");
const express_1 = require("express");
const middleware_1 = require("../middleware");
// Middleware: Extract user from JWT and attach to request
const router = (0, express_1.Router)();
exports.bailRouter = router;
router.use(middleware_1.authMiddleware);
// Fetch all applicants
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bails = yield db_1.prismaClient.applicant.findMany();
    res.json(bails);
}));
// Fetch a single applicant by ID
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const bail = yield db_1.prismaClient.applicant.findUnique({
        where: {
            id: parseInt(id),
        },
    });
    res.json(bail);
}));
// Create a new applicant associated with the logged-in user
router.post("/", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const body = req.body;
        const { applicantName, email, caseNumber, address, additionalInfo, file, } = body;
        // Access the logged-in user's ID from the JWT
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        // Create the applicant and associate it with the logged-in user
        const applicant = yield db_1.prismaClient.applicant.create({
            //  @ts-ignore
            data: {
                applicantName,
                email,
                caseNumber,
                address,
                additionalInfo,
                file,
                userid: userId,
            },
        });
        res.status(201).json(applicant);
    }
    catch (error) {
        console.error("Error creating applicant:", error);
        res
            .status(500)
            .json({ message: "An error occurred while creating the applicant." });
    }
}));
