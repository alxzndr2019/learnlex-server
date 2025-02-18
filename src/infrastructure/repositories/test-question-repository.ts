import { injectable } from "tsyringe";
import { TestQuestionRepository } from "../../application/interfaces/test-question-repository";
import { TestQuestion } from "../../core/entities/test-question";

@injectable()
export class MongoTestQuestionRepository implements TestQuestionRepository {
  async createTest(
    sessionId: string
  ): Promise<{ id: string; questions: TestQuestion[] }> {
    // TODO: Implement test creation logic
    return { id: sessionId, questions: [] };
  }

  async findById(id: string): Promise<TestQuestion | null> {
    // TODO: Implement find by id logic
    return null;
  }

  async findBySessionId(sessionId: string): Promise<TestQuestion[]> {
    // TODO: Implement find by session id logic
    return [];
  }

  async saveAnswer(
    questionId: string,
    answer: number,
    isCorrect: boolean
  ): Promise<void> {
    // TODO: Implement save answer logic
  }

  async getTestResults(sessionId: string): Promise<{
    score: number;
    totalQuestions: number;
    completedAt: Date;
    answers: Array<{ questionId: string; answer: number; isCorrect: boolean }>;
  }> {
    // TODO: Implement get test results logic
    return {
      score: 0,
      totalQuestions: 0,
      completedAt: new Date(),
      answers: [],
    };
  }
}
