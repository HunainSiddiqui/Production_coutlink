import {z} from "zod";


export const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
  fullname: z.string().min(4),
  role: z.enum(["Prisoner", "Lawyer"]),
});


export const SigninSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

// Validating the schema for the prisoner form
export const PrisonerFormSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Invalid email address."),
  prisonerId: z.string().min(1, "Prisoner ID is required."),
  dateOfBirth: z.string(),
  prisonLocation: z.string().min(1, "Prison location is required."),
  crime: z.string().min(1, "Crime description is required."),
  securityQuestion: z.string().min(1, "Security question is required."),
  emergencyContact: z
    .string()
    .min(10, "Emergency contact must be at least 10 digits."),
  inmateStatus: z.string(),
  caseId: z.string().min(1, "Case ID is required."),
  languagePreference: z.string().min(1, "Language preference is required."),
  medicalInfo: z.string(),
  additionalInfo: z.string().optional(),
});


//  lawyer validation schema 
export const LawyerFormSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Invalid email address."),
  contacts: z.string().min(10, "Contact must be at least 10 digits."),
  dateOfBirth: z.string(),
  barRegistrationNumber: z
    .string()
    .min(1, "Bar Registration Number is required"),

  casesSolved: z
    .string()
    .min(0, "Cases Solved must be a non-negative integer"),
     

  specializations: z.string().min(1, "Specializations is required."),

  licenseVerified: z.string().min(1, "License No  is required."),

  availability: z.string(),
  additionalInfo: z.string().optional(),
});
