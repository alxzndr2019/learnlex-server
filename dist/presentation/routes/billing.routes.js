"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBillingRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const createBillingRouter = (billingController) => {
    const router = (0, express_1.Router)();
    // Apply authentication middleware to all routes
    router.use(auth_1.authenticateJWT);
    // Plan management
    router.get("/plan", billingController.getCurrentPlan);
    router.put("/plan", billingController.updatePlan);
    // Payment methods
    router.get("/payment-methods", billingController.getPaymentMethods);
    router.post("/payment-methods", billingController.addPaymentMethod);
    router.delete("/payment-methods/:id", billingController.removePaymentMethod);
    // Transactions
    router.get("/transactions", billingController.getTransactions);
    return router;
};
exports.createBillingRouter = createBillingRouter;
