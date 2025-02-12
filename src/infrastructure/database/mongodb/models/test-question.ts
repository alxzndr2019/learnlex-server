import mongoose, { Document } from "mongoose";

interface TestQuestionDocument extends Document {
  sessionId: mongoose.Types.ObjectId;
  question: string;
  choices: string[];
  correctAnswer: number;
  explanation: string;
  userAnswer?: number;
  isCorrect?: boolean;
}

const schema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
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

export const TestQuestionModel = mongoose.model<TestQuestionDocument>(
  "TestQuestion",
  schema
);
