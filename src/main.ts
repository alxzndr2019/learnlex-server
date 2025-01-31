import "reflect-metadata";
import express from "express";
import mongoose from "mongoose";
const cors = require("cors");
import { container } from "tsyringe";
import { VideoController } from "./presentation/controllers/video.controller";
import { AuthController } from "./presentation/controllers/auth.controller";
import { config } from "./config";
import { MongoVideoSessionRepository } from "./infrastructure/database/mongodb/repositories/video-session-repository";
import { MongoUserRepository } from "./infrastructure/database/mongodb/repositories/user-repository";
import { YoutubeApiService } from "./infrastructure/external/youtube-service";
import { OpenAIService } from "./infrastructure/external/openai-service";
import { ProcessVideoUseCase } from "./application/use-cases/process-video";
import { createVideoRouter } from "./presentation/routes/video.routes";
import { createAuthRouter } from "./presentation/routes/auth.routes";
import { loggingMiddleware } from "./presentation/middlewares/logging";
import logger from "./utils/logger";

// Configure DI
container.register("VideoSessionRepository", {
  useClass: MongoVideoSessionRepository,
});

container.register("UserRepository", {
  useClass: MongoUserRepository,
});

container.register("YoutubeService", {
  useClass: YoutubeApiService,
});

container.register("AIService", {
  useFactory: () => new OpenAIService(config.openaiKey),
});

async function bootstrap() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoUri);
    logger.info("Connected to MongoDB successfully");

    const app = express();

    // Add logging middleware
    app.use(loggingMiddleware);
    app.use(express.json());

    // Initialize controllers with dependencies
    const videoController = new VideoController(
      container.resolve(ProcessVideoUseCase)
    );

    const authController = container.resolve(AuthController);
    app.use(
      cors({
        origin: "http://localhost:3000", // Your frontend URL
        credentials: true, // Allow credentials
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );

    // Routes
    app.use("/api/videos", createVideoRouter(videoController));
    app.use("/api/auth", createAuthRouter(authController));

    const port = process.env.PORT || 4444;
    app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

bootstrap().catch((err) => {
  logger.error("Unhandled error:", err);
  process.exit(1);
});
