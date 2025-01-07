"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LawyerFormSchema = exports.PrisonerFormSchema = exports.SigninSchema = exports.SignupSchema = void 0;
const zod_1 = require("zod");
exports.SignupSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(4),
    fullname: zod_1.z.string().min(4),
    role: zod_1.z.enum(["Prisoner", "Lawyer"]),
});
exports.SigninSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
// Validating the schema for the prisoner form
exports.PrisonerFormSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required."),
    email: zod_1.z.string().email("Invalid email address."),
    prisonerId: zod_1.z.string().min(1, "Prisoner ID is required."),
    dateOfBirth: zod_1.z.string(),
    prisonLocation: zod_1.z.string().min(1, "Prison location is required."),
    crime: zod_1.z.string().min(1, "Crime description is required."),
    securityQuestion: zod_1.z.string().min(1, "Security question is required."),
    emergencyContact: zod_1.z
        .string()
        .min(10, "Emergency contact must be at least 10 digits."),
    inmateStatus: zod_1.z.string(),
    caseId: zod_1.z.string().min(1, "Case ID is required."),
    languagePreference: zod_1.z.string().min(1, "Language preference is required."),
    medicalInfo: zod_1.z.string(),
    additionalInfo: zod_1.z.string().optional(),
});
//  lawyer validation schema 
exports.LawyerFormSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required."),
    email: zod_1.z.string().email("Invalid email address."),
    contacts: zod_1.z.string().min(10, "Contact must be at least 10 digits."),
    dateOfBirth: zod_1.z.string(),
    barRegistrationNumber: zod_1.z
        .string()
        .min(1, "Bar Registration Number is required"),
    casesSolved: zod_1.z
        .string()
        .min(0, "Cases Solved must be a non-negative integer"),
    specializations: zod_1.z.string().min(1, "Specializations is required."),
    licenseVerified: zod_1.z.string().min(1, "License No  is required."),
    availability: zod_1.z.string(),
    additionalInfo: zod_1.z.string().optional(),
});
