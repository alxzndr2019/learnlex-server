import { Router, RequestHandler } from "express";
import { BillingController } from "../controllers/billing.controller";
import { authenticateJWT } from "../middlewares/auth";

export const createBillingRouter = (
  billingController: BillingController
): Router => {
  const router = Router();

  // Apply authentication middleware to all routes
  router.use(authenticateJWT);

  // Plan management
  router.get("/plan", billingController.getCurrentPlan as RequestHandler);
  router.put("/plan", billingController.updatePlan as RequestHandler);

  // Payment methods
  router.get(
    "/payment-methods",
    billingController.getPaymentMethods as RequestHandler
  );
  router.post(
    "/payment-methods",
    billingController.addPaymentMethod as RequestHandler
  );
  router.delete(
    "/payment-methods/:id",
    billingController.removePaymentMethod as RequestHandler
  );

  // Transactions
  router.get(
    "/transactions",
    billingController.getTransactions as RequestHandler
  );

  return router;
};
