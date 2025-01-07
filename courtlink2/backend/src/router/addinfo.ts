import { Router, Request, Response } from "express";
import { prismaClient } from "../db";
import { authMiddleware } from "../middleware";

const router = Router();

interface AuthenticatedRequest extends Request {
  user?: { id: number; email: string };
}

router.post(
  "/undertrial",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    const body = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required to add undertrial information.",
      });
    }

    let prisonerId = await prismaClient.prisoner.findFirst({
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
      const contactRequest = await prismaClient.contactRequest.create({
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
    } catch (err) {
      //@ts-ignore
      console.error("Error submitting contact request:", err.message);
      return res.status(500).json({
        message: "An error occurred while submitting the contact request.",
      });
    }
  }
);

export const addinfo = router;
