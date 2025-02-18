"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    mongoUri: process.env.MONGO_URI ?? "",
    openaiKey: process.env.OPENAI_KEY ?? "",
    youtube: {
        apiKey: process.env.YOUTUBE_API_KEY ?? "",
    },
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID ?? "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        redirectUri: process.env.GOOGLE_REDIRECT_URI ?? "",
    },
    jwt: {
        secret: process.env.JWT_SECRET ?? "",
    },
    clientUrl: process.env.CLIENT_URL ?? "",
};
