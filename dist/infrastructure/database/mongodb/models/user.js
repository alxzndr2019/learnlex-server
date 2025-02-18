"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const tokenUsageSchema = new mongoose_1.default.Schema({
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    action: { type: String, enum: ["purchase", "spend"], required: true },
});
const userSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    picture: { type: String },
    googleId: { type: String, required: true, unique: true },
    tokens: { type: Number, default: 5 },
    completedSessions: [
        { type: mongoose_1.default.Schema.Types.ObjectId, ref: "VideoSession" },
    ],
    tokenUsage: [tokenUsageSchema],
    createdAt: { type: Date, default: Date.now },
});
exports.UserModel = mongoose_1.default.model("User", userSchema);
