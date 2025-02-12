import { TestQuestion } from "../../core/entities/test-question";

interface TestQuestionRepository {
  createTest(sessionId: string): Promise<{
    id: string;
    questions: TestQuestion[];
  }>;
  findById(id: string): Promise<TestQuestion | null>;
  findBySessionId(sessionId: string): Promise<TestQuestion[]>;
  saveAnswer(
    questionId: string,
    answer: number,
    isCorrect: boolean
  ): Promise<void>;
  getTestResults(sessionId: string): Promise<{
    score: number;
    totalQuestions: number;
    completedAt: Date;
    answers: Array<{
      questionId: string;
      answer: number;
      isCorrect: boolean;
    }>;
  }>;
}

export { TestQuestionRepository };
