import { TestQuestion } from "../../../../core/entities/test-question";
import { TestQuestionRepository } from "../../../../application/interfaces/test-question-repository";
import { TestQuestionModel } from "../models/test-question";
import { injectable } from "tsyringe";
import { AIService } from "../../../../application/interfaces/ai-service";
import { VideoSessionRepository } from "../../../../application/interfaces/video-session-repository";
import { inject } from "tsyringe";

@injectable()
export class MongoTestQuestionRepository implements TestQuestionRepository {
  constructor(
    @inject("AIService") private readonly aiService: AIService,
    @inject("VideoSessionRepository")
    private readonly videoSessionRepo: VideoSessionRepository
  ) {}

  async createTest(
    sessionId: string
  ): Promise<{ id: string; questions: TestQuestion[] }> {
    // Get the session to access its summary
    const session = await this.videoSessionRepo.findById(sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    // Generate questions using AI service
    const questions = await this.aiService.generateQuestions(session.summary);

    // Save questions to database
    const savedQuestions = await Promise.all(
      questions.map(async (q) => {
        const question = new TestQuestionModel({
          sessionId,
          question: q.question,
          choices: q.choices,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
        });
        const saved = await question.save();
        return this.toDomainEntity(saved);
      })
    );

    return {
      id: sessionId, // Using session ID as test ID for simplicity
      questions: savedQuestions,
    };
  }

  async findById(id: string): Promise<TestQuestion | null> {
    const question = await TestQuestionModel.findById(id);
    return question ? this.toDomainEntity(question) : null;
  }

  async findBySessionId(sessionId: string): Promise<TestQuestion[]> {
    const questions = await TestQuestionModel.find({ sessionId });
    return questions.map((q) => this.toDomainEntity(q));
  }

  async saveAnswer(
    questionId: string,
    answer: number,
    isCorrect: boolean
  ): Promise<void> {
    await TestQuestionModel.findByIdAndUpdate(questionId, {
      userAnswer: answer,
      isCorrect,
    });
  }

  async getTestResults(sessionId: string): Promise<{
    score: number;
    totalQuestions: number;
    completedAt: Date;
    answers: Array<{
      questionId: string;
      answer: number;
      isCorrect: boolean;
    }>;
  }> {
    const questions = await TestQuestionModel.find({
      sessionId,
      userAnswer: { $exists: true },
    });

    const answers = questions.map((q) => ({
      questionId: q._id.toString(),
      answer: q.userAnswer!,
      isCorrect: q.isCorrect!,
    }));

    const correctAnswers = answers.filter((a) => a.isCorrect).length;

    return {
      score: (correctAnswers / questions.length) * 100,
      totalQuestions: questions.length,
      completedAt: new Date(),
      answers,
    };
  }

  private toDomainEntity(doc: any): TestQuestion {
    return new TestQuestion(
      doc._id.toString(),
      doc.sessionId.toString(),
      doc.question,
      doc.choices,
      doc.correctAnswer,
      doc.explanation,
      doc.userAnswer,
      doc.isCorrect
    );
  }
}
