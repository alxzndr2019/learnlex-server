"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTokenRouter = void 0;
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const token_controller_1 = require("../controllers/token.controller");
const auth_1 = require("../middlewares/auth");
const createTokenRouter = () => {
    const router = (0, express_1.Router)();
    const tokenController = tsyringe_1.container.resolve(token_controller_1.TokenController);
    // Apply authentication middleware to all routes
    router.use(auth_1.authenticateJWT);
    // Get token balance and usage history
    router.get("/balance", tokenController.getBalance);
    // Purchase tokens
    router.post("/purchase", tokenController.purchaseTokens);
    return router;
};
exports.createTokenRouter = createTokenRouter;
