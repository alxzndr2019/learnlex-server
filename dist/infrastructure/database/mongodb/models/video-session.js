"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoSessionModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const videoSessionSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true },
    videoId: { type: String, required: true },
    summary: { type: String, required: true },
    status: {
        type: String,
        required: true,
        enum: ["processing", "ready", "completed"],
        default: "processing",
    },
    createdAt: { type: Date, default: Date.now },
    completedAt: Date,
    questions: { type: Array, default: [] },
    keyPoints: { type: Array, default: [] },
    progress: { type: Number, default: 0 },
    lastAccessed: { type: Date, default: Date.now },
});
exports.VideoSessionModel = mongoose_1.default.model("VideoSession", videoSessionSchema);
