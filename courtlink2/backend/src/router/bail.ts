import { prismaClient } from "../db";
import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware";
import ts from "typescript";

// Middleware: Extract user from JWT and attach to request
const router = Router();
router.use(authMiddleware);

// Use the extended Request interface
interface AuthenticatedRequest extends Request {
  user?: { id: number; email: string }; // Should match the payload structure in your JWT
}

// Fetch all applicants
router.get("/", async (req: Request, res: Response) => {
  const bails = await prismaClient.applicant.findMany();
  res.json(bails);
});

// Fetch a single applicant by ID
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const bail = await prismaClient.applicant.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  res.json(bail);
});

// Create a new applicant associated with the logged-in user
router.post(
  "/",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const body = req.body;
      const {
        applicantName,
        email,
        caseNumber,
        address,
        additionalInfo,
        file,
      } = body;

      // Access the logged-in user's ID from the JWT
      const userId = req.user?.id;

      // Create the applicant and associate it with the logged-in user
      const applicant = await prismaClient.applicant.create({
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
    } catch (error) {
      console.error("Error creating applicant:", error);
      res
        .status(500)
        .json({ message: "An error occurred while creating the applicant." });
    }
  }
);

export { router as bailRouter };
