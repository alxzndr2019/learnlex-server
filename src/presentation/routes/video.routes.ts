import { Router, RequestHandler } from "express";
import { VideoController } from "../controllers/video.controller";

export const createVideoRouter = (videoController: VideoController): Router => {
  const router = Router();

  router.post("/", videoController.processVideo as RequestHandler);

  return router;
};
