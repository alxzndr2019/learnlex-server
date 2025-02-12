import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../../config";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        picture?: string;
        tokens: number;
        stripeCustomerId?: string;
      };
    }
  }
}

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const tokenFromCookie = req.cookies.token;
  if (!tokenFromCookie) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  const token = tokenFromCookie;
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as {
      id: string;
      email: string;
      name: string;
      picture?: string;
      tokens: number;
      stripeCustomerId?: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }
};
