import mongoose, { Document } from "mongoose";
import { TestQuestion } from "../../../../core/entities/test-question";
export interface VideoSessionDocument extends Document {
  userId: string;
  videoId: string;
  summary: string;
  status: "processing" | "ready" | "completed";
  createdAt: Date;
  completedAt?: Date;
  questions?: TestQuestion[];
  keyPoints?: string[];
  progress: number;
  lastAccessed: Date;
}

const videoSessionSchema = new mongoose.Schema({
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

export const VideoSessionModel = mongoose.model<VideoSessionDocument>(
  "VideoSession",
  videoSessionSchema
);
