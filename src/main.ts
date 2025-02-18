import "reflect-metadata";
import express from "express";
import cookieParser from "cookie-parser";
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
import { createStatusRouter } from "./presentation/routes/status.routes";
import { StatusController } from "./presentation/controllers/status.controller";
import { loggingMiddleware } from "./presentation/middlewares/logging";
import logger from "./utils/logger";
import { MongoTestQuestionRepository } from "./infrastructure/database/mongodb/repositories/test-question-repository";
import { DefaultVideoService } from "./infrastructure/services/video-service";
import { MockPaymentService } from "./infrastructure/services/mock-payment-service";
//please work
// Register repositories
container.register("VideoSessionRepository", {
  useClass: MongoVideoSessionRepository,
});

container.register("UserRepository", {
  useClass: MongoUserRepository,
});

container.register("TestQuestionRepository", {
  useClass: MongoTestQuestionRepository,
});

// Register services
container.register("AIService", {
  useClass: OpenAIService,
});

container.register("YoutubeService", {
  useClass: YoutubeApiService,
});

container.register("PaymentService", {
  useClass: MockPaymentService,
});

container.register("VideoService", {
  useClass: DefaultVideoService,
});

// Register use cases
container.register(ProcessVideoUseCase, {
  useClass: ProcessVideoUseCase,
});

// Register controllers
container.register(VideoController, {
  useClass: VideoController,
});

container.register(AuthController, {
  useClass: AuthController,
});

container.register(StatusController, {
  useClass: StatusController,
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
    app.use(cookieParser());
    // Initialize controllers with dependencies
    const videoController = container.resolve(VideoController);
    const authController = container.resolve(AuthController);
    const statusController = container.resolve(StatusController);

    app.use(
      cors({
        origin: config.clientUrl,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );

    // Routes
    app.use("/api/videos", createVideoRouter(videoController));
    app.use("/api/auth", createAuthRouter(authController));
    app.use("/api/status", createStatusRouter(statusController));

    const port = process.env.PORT ?? 4444;
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
