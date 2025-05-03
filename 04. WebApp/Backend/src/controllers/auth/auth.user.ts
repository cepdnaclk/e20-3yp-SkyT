import { Response } from "express";
import { AuthRequest } from "../../middleware/jwtMiddleware";
import { NotificationModel } from "../../model/notifications";

export const verifyToken = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Invalid or missing token" });
    }

    const userId = parseInt(user.userId);
    const msgCount = await NotificationModel.getMsgCount(userId);

    console.log("Validate Token");

    res.status(200).json({
      message: "Token is valid",
      user: {
        userId,
        profilePic: user.profilePic,
        role: user.role,
        msgCount,
      },
    });
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
