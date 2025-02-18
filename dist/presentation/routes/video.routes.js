"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVideoRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const createVideoRouter = (videoController) => {
    const router = (0, express_1.Router)();
    // Apply authentication middleware to all routes
    router.use(auth_1.authenticateJWT);
    // Video processing
    router.post("/", videoController.processVideo);
    router.get("/:id", videoController.getSession);
    router.get("/user/sessions", videoController.getUserSessions);
    // Progress tracking
    router.post("/:id/progress", videoController.updateProgress);
    // Test management
    router.post("/:id/test", videoController.startTest);
    router.post("/:id/test/answer", videoController.submitAnswer);
    router.get("/:id/test/results", videoController.getTestResults);
    return router;
};
exports.createVideoRouter = createVideoRouter;
