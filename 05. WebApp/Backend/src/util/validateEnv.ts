import { bool, cleanEnv, port, str, num } from "envalid";

export default cleanEnv(process.env, {
  MONGO_URI: str(), // Mongo URI
  MYNODEPORT: port(), // Port for my Node.js server
  DB_SERVER: str(), // Azure SQL Database server
  DB_PORT: port(), // Azure SQL Port number
  DB_NAME: str(), // Azure SQL Database name
  DB_USER: str(), // Azure SQL Database username
  DB_PASSWORD: str(), // Azure SQL Database password
  DB_ENCRYPT: bool(), // Azure SQL Database encryption
  DB_TRUST_SERVER_CERTIFICATE: bool(), // Azure SQL Database certification
  HASHING_SALT: num(), // HASHING SALT
  JWT_SECRET: str(), // HASHING SALT
});
