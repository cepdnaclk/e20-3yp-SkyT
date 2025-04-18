import { cleanEnv } from "envalid";
import { port, str } from "envalid/dist/validators";

export default cleanEnv(process.env, {
  PORT: port(),
  DB_HOST: str(),
  DB_USER: str(),
  DB_PASSWORD: str(),
  DB_NAME: str(),
});
