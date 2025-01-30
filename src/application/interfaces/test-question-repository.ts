import { TestQuestion } from "../../core/entities/test-question";

export interface TestQuestionRepository {
  createQuestion(data: Omit<TestQuestion, "id">): Promise<TestQuestion>;
}
