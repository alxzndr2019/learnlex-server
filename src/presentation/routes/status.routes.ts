import { Router, RequestHandler } from "express";
import { StatusController } from "../controllers/status.controller";

export const createStatusRouter = (
  statusController: StatusController
): Router => {
  const router = Router();

  router.get("/", statusController.checkStatus as RequestHandler);

  return router;
};
