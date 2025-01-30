import { TestQuestion } from "./test-question";

export type VideoSessionStatus = "processing" | "ready" | "completed";

export class VideoSession {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly videoId: string,
    public summary: string,
    public status: VideoSessionStatus,
    public readonly createdAt: Date,
    public completedAt?: Date,
    public questions?: TestQuestion[],
    public keyPoints?: string[]
  ) {}
}
