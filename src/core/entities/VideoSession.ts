export class VideoSession {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly videoId: string,
    public readonly title: string,
    public readonly channelTitle: string,
    public readonly thumbnailUrl: string,
    public readonly duration: string,
    public readonly summary: string,
    public readonly status: "processing" | "ready" | "failed",
    public readonly createdAt: Date,
    public readonly completedAt?: Date,
    public readonly questions?: any[],
    public readonly keyPoints?: string[],
    public readonly progress: number = 0,
    public readonly lastAccessed: Date = new Date()
  ) {}
}
