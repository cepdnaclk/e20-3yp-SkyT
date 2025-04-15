import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import env from "../util/validateEnv";

const SECRET_KEY = env.JWT_SECRET;

interface decodedProp {
  id: string;
  role: string;
  exp: number;
  iat: number;
}

// Middleware to verify JWT token
export const authenticateUser: RequestHandler = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Get token from header

  //console.log("Token:", token);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" }); // 401: Unauthorized
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as decodedProp;
    //console.log("decodeObj: ", decoded);

    const accessType = validateAccess(decoded);
    //console.log("Access type: ", accessType);

    return res.status(200).json(accessType);
  } catch (error) {
    next(error);
  }
};

// Function to validate access
function validateAccess(decoded: decodedProp) {
  // Time validation
  const currentTime = Math.floor(Date.now() / 1000);
  if (decoded.exp < currentTime) return "denied";

  // Role-based access
  let accessType: string;
  switch (decoded.role) {
    case "හිමිකරු":
    case "පරිපාලක":
      accessType = "valid";
      break;

    case "තාවකාලික":
      accessType = "forbidden";
      break;

    default:
      accessType = "denied";
      break;
  }

  return accessType;
}
