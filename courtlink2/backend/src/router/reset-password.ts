import { Router, Request, Response, NextFunction } from "express";
import nodemailer from "nodemailer";
import asyncHandler from "express-async-handler";
import { prismaClient } from "../db"; 
import bcrypt from "bcryptjs";
const sendEmail = require("./sendemail");

const router = Router();
var Randomopt = 0 ;
var created_time = new Date();
router.post(
  "/forgotpassword",
  // @ts-ignore
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email field is required",
      });
    }

    try {
      // Find user by email
      const userAvailable = await prismaClient.user.findUnique({
        where: { email },
      });

      if (!userAvailable) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      Randomopt = Math.floor(10000 + Math.random() * 90000);
      created_time = new Date();

      const message = `Your OTP is ${Randomopt} \n\nIf you have not requested this email then, please ignore it.`;
  
    try {
      await sendEmail({
        email: userAvailable.email,
        subject: `CourtLink Password Recovery`,
        message,
      });
  
      res.status(200).json({
        success: true,
        message: `Email sent to ${userAvailable.email} successfully`,
      });
    } catch (error) {
      console.error("Email could not be sent", error);
      return res.status(500).json({ success: false, message: "Email could not be sent" });
    }

    } catch (error) {
      return next(error); // Pass error to the global error handler
    }
  })
);

router.post("/resetpassword", async (req: Request, res: Response) => {
  const { email, otp, password , confirmpassword } = req.body;

  if (!email || !otp || !password || !confirmpassword) {
    return res.status(400).json({
      success: false,
      message: "Email, OTP and Password fields are required",
    });
  }

  if (password !== confirmpassword) {
    return res.status(400).json({
      success: false,
      message: "Password and Confirm Password do not match",
    });
  }

  try {
    const userAvailable = await prismaClient.user.findUnique({
      where: { email },
    });

    if (!userAvailable) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (otp !== Randomopt && new Date().getTime() - created_time.getTime() > 300000) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP or expired",
      });
    }

    //encrypt password

    const newpassword = await bcrypt.hash(password, 10)

    const updatedUser = await prismaClient.user.update({
      where: { email },
      data: {
        password:newpassword,
      },
    });

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Password could not be updated" });
  }
}
);

export const resetPasswordRouter = router;
