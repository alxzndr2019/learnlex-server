import { injectable, inject } from "tsyringe";
import { VideoService } from "../../application/services/video-service";
import { YoutubeService } from "../../application/interfaces/youtube-service";
import { AIService } from "../../application/interfaces/ai-service";
import { VideoSessionRepository } from "../../application/interfaces/video-session-repository";

@injectable()
export class DefaultVideoService implements VideoService {
  constructor(
    @inject("YoutubeService") private youtubeService: YoutubeService,
    @inject("AIService") private aiService: AIService,
    @inject("VideoSessionRepository")
    private videoSessionRepository: VideoSessionRepository
  ) {}

  async processVideo(url: string, userId: string) {
    const videoId = this.youtubeService.extractVideoId(url);
    const transcript = await this.youtubeService.getTranscript(videoId);
    const videoDetails = await this.youtubeService.getVideoDetails(videoId);

    const summary = await this.aiService.generateSummary(transcript);
    const questions = await this.aiService.generateQuestions(summary);
    const keyPoints = await this.aiService.explainInKeyPoints(transcript);

    return this.videoSessionRepository.createSession({
      userId,
      videoId,
      title: videoDetails.title,
      channelTitle: videoDetails.channelTitle,
      thumbnailUrl: videoDetails.thumbnailUrl,
      duration: videoDetails.duration,
      summary,
      questions,
      keyPoints,
      status: "ready",
      progress: 0,
      lastAccessed: new Date(),
    });
  }

  async getVideoDetails(videoId: string) {
    return this.youtubeService.getVideoDetails(videoId);
  }

  async getVideoTranscript(videoId: string) {
    return this.youtubeService.getTranscript(videoId);
  }
}
