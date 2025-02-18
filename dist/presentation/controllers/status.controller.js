"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusController = void 0;
const tsyringe_1 = require("tsyringe");
const config_1 = require("../../config");
const google_auth_library_1 = require("google-auth-library");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let StatusController = class StatusController {
    constructor(aiService, youtubeService) {
        this.aiService = aiService;
        this.youtubeService = youtubeService;
        this.checkStatus = async (_req, res) => {
            const status = {
                mongodb: {
                    configured: Boolean(config_1.config.mongoUri),
                    status: "checking...",
                },
                openai: {
                    configured: Boolean(config_1.config.openaiKey),
                    status: "checking...",
                },
                youtube: {
                    configured: Boolean(config_1.config.youtube.apiKey),
                    status: "checking...",
                },
                google: {
                    configured: Boolean(config_1.config.google.clientId &&
                        config_1.config.google.clientSecret &&
                        config_1.config.google.redirectUri),
                    status: "checking...",
                },
                jwt: {
                    configured: Boolean(config_1.config.jwt.secret),
                    status: "checking...",
                },
                client: {
                    configured: Boolean(config_1.config.clientUrl),
                    status: "checking...",
                },
            };
            // Check MongoDB connection
            try {
                const mongoose = require("mongoose");
                if (mongoose.connection.readyState === 1) {
                    status.mongodb.status = "connected";
                }
                else {
                    status.mongodb.status = "disconnected";
                }
            }
            catch (error) {
                status.mongodb.status = "error";
            }
            // Check OpenAI connection
            try {
                await this.aiService.generateSummary("test connection");
                status.openai.status = "connected";
            }
            catch (error) {
                status.openai.status =
                    "error: " + (error instanceof Error ? error.message : "unknown error");
            }
            // Check YouTube API
            try {
                await this.youtubeService.getVideoDetails("dQw4w9WgXcQ");
                status.youtube.status = "connected";
            }
            catch (error) {
                status.youtube.status =
                    "error: " + (error instanceof Error ? error.message : "unknown error");
            }
            // Check Google OAuth
            try {
                const oauth2Client = new google_auth_library_1.OAuth2Client(config_1.config.google.clientId, config_1.config.google.clientSecret, config_1.config.google.redirectUri);
                const url = oauth2Client.generateAuthUrl({
                    access_type: "offline",
                    scope: ["profile", "email"],
                });
                status.google.status = url ? "configured" : "error";
            }
            catch (error) {
                status.google.status =
                    "error: " + (error instanceof Error ? error.message : "unknown error");
            }
            // Check JWT
            try {
                jsonwebtoken_1.default.sign({ test: true }, config_1.config.jwt.secret);
                status.jwt.status = "configured";
            }
            catch (error) {
                status.jwt.status =
                    "error: " + (error instanceof Error ? error.message : "unknown error");
            }
            // Check Client URL
            try {
                const url = new URL(config_1.config.clientUrl);
                status.client.status = "configured";
            }
            catch (error) {
                status.client.status = "error: invalid URL";
            }
            res.json({
                status: "operational",
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV || "development",
                services: status,
                version: process.env.npm_package_version || "unknown",
            });
        };
    }
};
exports.StatusController = StatusController;
exports.StatusController = StatusController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("AIService")),
    __param(1, (0, tsyringe_1.inject)("YoutubeService")),
    __metadata("design:paramtypes", [Object, Object])
], StatusController);
