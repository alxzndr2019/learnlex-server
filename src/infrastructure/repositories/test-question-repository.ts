import { injectable } from "tsyringe";
import { TestQuestionRepository } from "../../application/interfaces/test-question-repository";

@injectable()
export class MongoTestQuestionRepository implements TestQuestionRepository {
  async create(question: any): Promise<any> {
    // Implement creation logic
    return question;
  }

  async findById(id: string): Promise<any> {
    // Implement find by id logic
    return null;
  }

  async findBySessionId(sessionId: string): Promise<any[]> {
    // Implement find by session id logic
    return [];
  }

  async update(id: string, question: any): Promise<any> {
    // Implement update logic
    return question;
  }

  async delete(id: string): Promise<void> {
    // Implement delete logic
  }
}
