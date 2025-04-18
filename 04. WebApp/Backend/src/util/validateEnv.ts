import { cleanEnv } from "envalid";
import { port, str } from "envalid/dist/validators";

export default cleanEnv(process.env, {
  PORT: port(),
  DB_HOST: str(),
  DB_PORT: port(),
  DB_USER: str(),
  DB_PASSWORD: str(),
  DB_NAME: str(),
  FRONTEND_URL: str(),
  EMAIL_SERVICE: str(),
  EMAIL_USER: str(),
  EMAIL_PASS: str(),
  JWT_SECRET: str(),
});
