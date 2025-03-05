import { cleanEnv, port, str, num } from "envalid";

export default cleanEnv(process.env, {
  MONGO_URI: str(), // MongoDB connection URI
  MONGO_DBNAME: str(), // MongoDB databseName
  MYNODEPORT: port(), // Node.js server port

  AWS_HOST: str(), // AWS MySQL Host
  AWS_USER: str(), // AWS MySQL Username
  AWS_PSWD: str(), // AWS MySQL Password
  AWS_DBAS: str(), // AWS MySQL Database Name
  AWS_PORT: num(), // AWS MySQL Port

  HASHING_SALT: num(), // Salt for password hashing
  JWT_SECRET: str(), // JWT secret key for authentication
});
