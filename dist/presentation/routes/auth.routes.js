"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const createAuthRouter = (authController) => {
    const router = (0, express_1.Router)();
    router.get("/google", authController.initiateGoogleAuth);
    router.get("/google/callback", authController.googleCallback);
    router.get("/me", auth_1.authenticateJWT, authController.getCurrentUser);
    return router;
};
exports.createAuthRouter = createAuthRouter;
