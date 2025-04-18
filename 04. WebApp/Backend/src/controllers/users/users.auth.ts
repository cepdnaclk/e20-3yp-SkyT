import { Response } from "express";
import { AuthRequest } from "../../middleware/jwtMiddleware";

export const verifyToken = (req: AuthRequest, res: Response) => {
  const user = req.user;

  res.status(200).json({
    message: "Token is valid",
    user: {
      userId: user?.userId,
      email: user?.email,
      role: user?.role,
    },
  });
};
