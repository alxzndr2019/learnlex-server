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
  sessionId: { type: mongoose.Types.ObjectId, required: true },
  question: String,
  choices: [String],
  correctAnswer: Number,
  explanation: String,
  userAnswer: Number,
  isCorrect: Boolean,
});

export const TestQuestionModel = mongoose.model<TestQuestionDocument>(
  "TestQuestion",
  schema
);
