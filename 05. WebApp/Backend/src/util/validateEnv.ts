import { cleanEnv, port, str, num } from "envalid";

export default cleanEnv(process.env, {
  MONGO_URI: str(), // Mongo URI
  MYNODEPORT: port(), // Port for my Node.js server

  AWS_HOST: str(),
  AWS_USER: str(),
  AWS_PSWD: str(),
  AWS_DBAS: str(),
  AWS_PORT: num(),

  HASHING_SALT: num(), // HASHING SALT
  JWT_SECRET: str(), // HASHING SALT
});
