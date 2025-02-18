"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStatusRouter = void 0;
const express_1 = require("express");
const createStatusRouter = (statusController) => {
    const router = (0, express_1.Router)();
    router.get("/", statusController.checkStatus);
    return router;
};
exports.createStatusRouter = createStatusRouter;
