"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors = require("cors");
const tsyringe_1 = require("tsyringe");
const video_controller_1 = require("./presentation/controllers/video.controller");
const auth_controller_1 = require("./presentation/controllers/auth.controller");
const config_1 = require("./config");
const video_session_repository_1 = require("./infrastructure/database/mongodb/repositories/video-session-repository");
const user_repository_1 = require("./infrastructure/database/mongodb/repositories/user-repository");
const youtube_service_1 = require("./infrastructure/external/youtube-service");
const openai_service_1 = require("./infrastructure/external/openai-service");
const process_video_1 = require("./application/use-cases/process-video");
const video_routes_1 = require("./presentation/routes/video.routes");
const auth_routes_1 = require("./presentation/routes/auth.routes");
const status_routes_1 = require("./presentation/routes/status.routes");
const status_controller_1 = require("./presentation/controllers/status.controller");
const logging_1 = require("./presentation/middlewares/logging");
const logger_1 = __importDefault(require("./utils/logger"));
const test_question_repository_1 = require("./infrastructure/database/mongodb/repositories/test-question-repository");
const video_service_1 = require("./infrastructure/services/video-service");
//please work
// Register repositories
tsyringe_1.container.register("VideoSessionRepository", {
    useClass: video_session_repository_1.MongoVideoSessionRepository,
});
tsyringe_1.container.register("UserRepository", {
    useClass: user_repository_1.MongoUserRepository,
});
tsyringe_1.container.register("TestQuestionRepository", {
    useClass: test_question_repository_1.MongoTestQuestionRepository,
});
// Register services
tsyringe_1.container.register("YoutubeService", {
    useClass: youtube_service_1.YoutubeApiService,
});
tsyringe_1.container.register("AIService", {
    useFactory: () => new openai_service_1.OpenAIService(config_1.config.openaiKey),
});
tsyringe_1.container.register("VideoService", {
    useClass: video_service_1.DefaultVideoService,
});
// Register use cases
tsyringe_1.container.register(process_video_1.ProcessVideoUseCase, {
    useClass: process_video_1.ProcessVideoUseCase,
});
// Register controllers
tsyringe_1.container.register(video_controller_1.VideoController, {
    useClass: video_controller_1.VideoController,
});
tsyringe_1.container.register(auth_controller_1.AuthController, {
    useClass: auth_controller_1.AuthController,
});
tsyringe_1.container.register(status_controller_1.StatusController, {
    useClass: status_controller_1.StatusController,
});
async function bootstrap() {
    try {
        // Connect to MongoDB
        await mongoose_1.default.connect(config_1.config.mongoUri);
        logger_1.default.info("Connected to MongoDB successfully");
        const app = (0, express_1.default)();
        // Add logging middleware
        app.use(logging_1.loggingMiddleware);
        app.use(express_1.default.json());
        app.use((0, cookie_parser_1.default)());
        // Initialize controllers with dependencies
        const videoController = tsyringe_1.container.resolve(video_controller_1.VideoController);
        const authController = tsyringe_1.container.resolve(auth_controller_1.AuthController);
        const statusController = tsyringe_1.container.resolve(status_controller_1.StatusController);
        app.use(cors({
            origin: config_1.config.clientUrl,
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
        }));
        // Routes
        app.use("/api/videos", (0, video_routes_1.createVideoRouter)(videoController));
        app.use("/api/auth", (0, auth_routes_1.createAuthRouter)(authController));
        app.use("/api/status", (0, status_routes_1.createStatusRouter)(statusController));
        const port = process.env.PORT ?? 4444;
        app.listen(port, () => {
            logger_1.default.info(`Server running on port ${port}`);
        });
    }
    catch (error) {
        logger_1.default.error("Failed to start server:", error);
        process.exit(1);
    }
}
bootstrap().catch((err) => {
    logger_1.default.error("Unhandled error:", err);
    process.exit(1);
});
