import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config";

// Extend Request interface to include user payload
interface AuthenticatedRequest extends Request {
  user?: any; // Add 'user' field or whatever is returned from the JWT payload
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(" ")[1]; 
  


  if (!token) {
    return res.status(403).json({
      message: "Token is required",
    });
  }

  try {
    const payload = jwt.verify(token, JWT_PASSWORD) as { [key: string]: any }; 

    req.user = payload; 
    next();
  } catch (e) {
    return res.status(403).json({
      message: "You are not Logged in",
    });
  }
}
