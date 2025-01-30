import { AIService } from "../interfaces/ai-service";
import { VideoSessionRepository } from "../interfaces/video-session-repository";
import { MongoTestQuestionRepository } from "../../infrastructure/database/mongodb/repositories/test-question-repository";
import { TestQuestion } from "../../core/entities/test-question";
export class GenerateTestUseCase {
  constructor(
    private readonly aiService: AIService,
    private readonly videoRepo: VideoSessionRepository,
    private readonly testRepo: MongoTestQuestionRepository
  ) {}

  async execute(sessionId: string): Promise<TestQuestion[]> {
    const session = await this.videoRepo.findById(sessionId);
    if (!session) throw new Error("Session not found");

    const questions = await this.aiService.generateQuestions(session.summary);

    return Promise.all(
      questions.map((question) =>
        this.testRepo.createQuestion({
          ...question,
          sessionId,
        })
      )
    );
  }
}
