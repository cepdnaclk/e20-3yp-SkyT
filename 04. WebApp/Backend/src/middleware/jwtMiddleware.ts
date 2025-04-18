import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import env from "../util/validateEnv";

export interface AuthRequest extends Request {
  user?: decordedProps;
}

interface decordedProps {
  userId: string;
  role: string;
  email: string;
  exp: number;
  iat: number;
}

const jwtMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(createHttpError(401, "No token provided"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as decordedProps;
    req.user = decoded;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      console.error("JWT_Error: Token has expired.");
      next(createHttpError(401, "Token expired"));
    } else if (err instanceof jwt.JsonWebTokenError) {
      console.log("JWT_Error: Invalid token");
      next(createHttpError(401, "Invalid token"));
    } else {
      console.log("JWT_Error: Something went wrong");
      next(createHttpError(500, "Something went wrong"));
    }
  }
};

export default jwtMiddleware;
