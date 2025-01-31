import "reflect-metadata";
import express from "express";
import mongoose from "mongoose";
const cors = require("cors");
import { container } from "tsyringe";
import { VideoController } from "./presentation/controllers/video.controller";
import { AuthController } from "./presentation/controllers/auth.controller";
import { config } from "../config";
import { MongoVideoSessionRepository } from "./infrastructure/database/mongodb/repositories/video-session-repository";
import { MongoUserRepository } from "./infrastructure/database/mongodb/repositories/user-repository";
import { YoutubeApiService } from "./infrastructure/external/youtube-service";
import { OpenAIService } from "./infrastructure/external/openai-service";
import { ProcessVideoUseCase } from "./application/use-cases/process-video";
import { createVideoRouter } from "./presentation/routes/video.routes";
import { createAuthRouter } from "./presentation/routes/auth.routes";

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
  // Connect to MongoDB
  await mongoose.connect(config.mongoUri);

  const app = express();
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

  app.listen(4444, () => {
    console.log("Server running on port 4444");
  });
}

bootstrap().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
