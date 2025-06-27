import express, { Request, Response, NextFunction } from "express";
import logger from "./utils/logger";
import morganMiddleware from "./middlewares/morganMiddleware";

const app = express();

// Apply morgan middleware for HTTP request logging
app.use(morganMiddleware);

// Add request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info(`Incoming ${req.method} request to ${req.url}`);
  next();
});

// Add error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error processing ${req.method} request to ${req.url}`);
  logger.error(err.stack || err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

// Example route with logging
app.get("/health", (_req: Request, res: Response) => {
  logger.info("Health check endpoint accessed");
  res.json({ status: "healthy" });
});

// Log when the app is created
logger.info("Express app initialized");

export default app;