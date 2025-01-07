import { Router, Request, Response } from "express"; 
import { prismaClient } from "../db";
import { authMiddleware } from "../middleware";


const router = Router();

interface AuthenticatedRequest extends Request {
  user?: { id: number; email: string };
}

// GET route to fetch appointment requests for the lawyer
router.get("/requests",  
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(400).json({
      message: "User ID is required to fetch appointment requests.",
    });
  }

  try {
    // Find the lawyer's record based on userId
    const lawyer = await prismaClient.lawyer.findUnique({
      where: { userId },
    });

    if (!lawyer) {
      return res.status(404).json({
        message: "Lawyer record not found.",
      });
    }

    // Fetch the contact requests assigned to the lawyer
    const requests = await prismaClient.contactRequest.findMany({
      where: { lawyerId: lawyer.id },
    });

    return res.status(200).json({
      message: "Appointment requests fetched successfully.",
      requests,
    });
  } catch (error) {
    // console.error("Error fetching appointment requests:", error.message);
    return res.status(500).json({
      message: "An error occurred while fetching appointment requests.",
    });
  }
});

// PUT route to accept or reject the request
router.put("/respond-request", async (req: Request, res: Response) => {
  const { requestId, status } = req.body; // Status can be "Accepted" or "Rejected"

  if (!requestId || !status) {
    return res.status(400).json({
      message: "Request ID and status are required.",
    });
  }

  try {
    const contactRequest = await prismaClient.contactRequest.update({
      where: { id: requestId },
      data: { status },
    });

    return res.status(200).json({
      message: "Request status updated successfully.",
      contactRequest,
    });
  } catch (error) {
    // console.error("Error updating request status:", error.message);
    return res.status(500).json({
      message: "An error occurred while updating the request status.",
    });
  }
});

export default router;
