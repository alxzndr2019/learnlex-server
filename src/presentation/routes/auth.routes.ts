import { Router, RequestHandler } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticateJWT } from "../middlewares/auth";

export const createAuthRouter = (authController: AuthController): Router => {
  const router = Router();

  router.get("/google", authController.initiateGoogleAuth as RequestHandler);
  router.get(
    "/google/callback",
    authController.googleCallback as RequestHandler
  );
  router.get(
    "/me",
    authenticateJWT,
    authController.getCurrentUser as RequestHandler
  );

  return router;
};
