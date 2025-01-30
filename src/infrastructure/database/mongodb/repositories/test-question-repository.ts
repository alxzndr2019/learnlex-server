import { TestQuestion } from "../../../../core/entities/test-question";
import { TestQuestionRepository } from "../../../../application/interfaces/test-question-repository";
import { TestQuestionModel } from "../models/test-question";

export class MongoTestQuestionRepository implements TestQuestionRepository {
  async createQuestion(data: Omit<TestQuestion, "id">): Promise<TestQuestion> {
    const question = new TestQuestionModel(data);
    const saved = await question.save();
    return this.toDomainEntity(saved);
  }

  async findById(id: string): Promise<TestQuestion | null> {
    const question = await TestQuestionModel.findById(id);
    return question ? this.toDomainEntity(question) : null;
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
