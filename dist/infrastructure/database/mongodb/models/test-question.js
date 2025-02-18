"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestQuestionModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    sessionId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "VideoSession",
    },
    question: { type: String, required: true },
    choices: { type: [String], required: true },
    correctAnswer: { type: Number, required: true },
    explanation: { type: String, required: true },
    userAnswer: { type: Number },
    isCorrect: { type: Boolean },
    createdAt: { type: Date, default: Date.now },
});
exports.TestQuestionModel = mongoose_1.default.model("TestQuestion", schema);
