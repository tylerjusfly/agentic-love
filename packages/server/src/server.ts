// Import required modules
import dotenv from "dotenv";
import app from "./app";
import logger from "./utils/logger";
// import { startCronJobs } from "./modules/scheduler/scheduler";

// Load environment variables
dotenv.config();

// General error handlers
process.on("unhandledRejection", (err: any) => {
  console.log(err.name, err.message);
  console.log("Unhandled Rejection 😢");
});

process.on("uncaughtException", (err: any) => {
  console.log(err.name, err.message);
  console.log("Uncaught Exception 😪");
});

const mongoUrl = process.env.DATABASE?.replace(
  "<password>",
  process.env.DATABASE_PASSWORD || ""
);

function validateEnvironment() {
  if (!process.env.EMAIL_USER) {
    throw new Error('EMAIL_USER is not set.');
  }

  // if (!process.env.EMAIL_PASS) {
  //   throw new Error('EMAIL_PASS is not set.');
  // }

  // if (!process.env.TO_EMAIL) {
  //   throw new Error('TO_EMAIL is not set.');
  // }

  if ((process.env.LLM_PROVIDER !== 'GEMINI') && !process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set.');
  }

  if ((process.env.LLM_PROVIDER === 'GEMINI') && !process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set.');
  }

}

// Create a global variable to hold the Mongoose connection
// let db: typeof mongoose;

// Connect to MongoDB using Mongoose
// async function connectToMongo(): Promise<void> {
//   if (!mongoUrl) {
//     console.error("MongoDB URL is not defined in environment variables.");
//     process.exit(1);
//   }

//   try {
//     // Connect to MongoDB and assign the returned mongoose instance to `db`
//     db = await mongoose.connect(mongoUrl as any);

//     console.log("MongoDB connection established successfully.");
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//   }
// }

// Shutdown the connection
async function shutdown(): Promise<void> {
  try {
    console.log("Closing Postgres connection...");
    // await mongoose.connection.close(); // Correct method to close the connection
    console.log("Postgres connection closed");
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
}

// Listen for SIGINT and SIGTERM signals
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Start the Node.js app and connect to MongoDB using Mongoose
// connectToMongo().catch((error) => {
//   console.error("Error starting the app:", error);
//   process.exit(1);
// });

// Get port from environment variable or use default
const port = process.env.PORT || 4000;
// Start the server
app.listen(port, async() => {
    validateEnvironment()
    // startCronJobs()

  logger.info(`🚀 Server is running at http://localhost:${port}`);
  logger.debug("Debug logging is enabled");
});