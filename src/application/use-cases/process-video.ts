// application/use-cases/process-video.ts
import { inject, injectable } from "tsyringe";
import { VideoSession } from "../../core/entities/video-session";

@injectable()
export class ProcessVideoUseCase {
  constructor(
    @inject("YoutubeService") private readonly youtubeService: any,
    @inject("AIService") private readonly aiService: any,
    @inject("VideoSessionRepository")
    private readonly videoSessionRepository: any
  ) {}

  async execute(videoUrl: string, userId: string): Promise<VideoSession> {
    // 1. Validate URL
    const videoId = this.youtubeService.extractVideoId(videoUrl);

    // 2. Get Transcript
    const transcript = await this.youtubeService.getTranscript(videoId);

    // 3. Generate Summary
    const summary = await this.aiService.generateSummary(transcript);

    const questions = await this.aiService.generateQuestions(summary);
    const keyPoints = await this.aiService.explainInKeyPoints(transcript);
    // const concept = await this.aiService.explainConcept(transcript);
    // const deeply = await this.aiService.explainDeeply(transcript);

    // 4. Create Session
    return this.videoSessionRepository.createSession({
      userId,
      videoId,
      summary,
      questions,
      keyPoints,
      //   concept,
      //   deeply,
      status: "ready",
    });
  }
}
