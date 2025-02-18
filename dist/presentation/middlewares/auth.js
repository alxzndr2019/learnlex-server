"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../config");
const authenticateJWT = (req, res, next) => {
    const tokenFromCookie = req.cookies.token;
    if (!tokenFromCookie) {
        res.status(401).json({ error: "No token provided" });
        return;
    }
    const token = tokenFromCookie;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwt.secret);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ error: "Invalid token" });
        return;
    }
};
exports.authenticateJWT = authenticateJWT;
