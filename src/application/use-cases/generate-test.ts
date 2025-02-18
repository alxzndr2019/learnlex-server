import { AIService } from "../interfaces/ai-service";
import { VideoSessionRepository } from "../interfaces/video-session-repository";
import { TestQuestionRepository } from "../interfaces/test-question-repository";
import { TestQuestion } from "../../core/entities/test-question";

export class GenerateTestUseCase {
  constructor(
    private readonly aiService: AIService,
    private readonly videoRepo: VideoSessionRepository,
    private readonly testRepo: TestQuestionRepository
  ) {}

  async execute(sessionId: string): Promise<TestQuestion[]> {
    const { questions } = await this.testRepo.createTest(sessionId);
    return questions;
  }
}
