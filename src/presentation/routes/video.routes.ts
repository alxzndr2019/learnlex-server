import { Router, RequestHandler } from "express";
import { VideoController } from "../controllers/video.controller";
import { authenticateJWT } from "../middlewares/auth";

export const createVideoRouter = (videoController: VideoController): Router => {
  const router = Router();

  // Apply authentication middleware to all routes
  router.use(authenticateJWT);

  // Video processing
  router.post("/", videoController.processVideo as RequestHandler);
  router.get("/:id", videoController.getSession as RequestHandler);
  router.get(
    "/user/sessions",
    videoController.getUserSessions as RequestHandler
  );

  // Progress tracking
  router.post(
    "/:id/progress",
    videoController.updateProgress as RequestHandler
  );

  // Test management
  router.post("/:id/test", videoController.startTest as RequestHandler);
  router.post(
    "/:id/test/answer",
    videoController.submitAnswer as RequestHandler
  );
  router.get(
    "/:id/test/results",
    videoController.getTestResults as RequestHandler
  );

  return router;
};
