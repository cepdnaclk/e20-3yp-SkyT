import { azureDB as connectToAzureSQL } from "./database/azureDbConfig";
import "./database/mongoDbConfig";
import "dotenv/config";
import env from "./util/validateEnv";
import app from "./app";

const port = env.MYNODEPORT;

const startServer = async () => {
  try {
    // Connect to Azure SQL Database
    await connectToAzureSQL();

    // MongoDB connection is already established when importing mongoDbConfig
    // MongoDB will log connection status in its config file

    console.log("Both databases connected successfully!");

    // Starting the server
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error("Error connecting to databases:", err);
  }
};

startServer();
