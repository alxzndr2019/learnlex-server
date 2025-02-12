import { Router, RequestHandler } from "express";
import { container } from "tsyringe";
import { TokenController } from "../controllers/token.controller";
import { authenticateJWT } from "../middleware/auth";

export const createTokenRouter = () => {
  const router = Router();
  const tokenController = container.resolve(TokenController);

  // Apply authentication middleware to all routes
  router.use(authenticateJWT as RequestHandler);

  // Get token balance and usage history
  router.get("/balance", tokenController.getBalance as RequestHandler);

  // Purchase tokens
  router.post("/purchase", tokenController.purchaseTokens as RequestHandler);

  return router;
};
