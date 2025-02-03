import { TestQuestion } from "../../core/entities/test-question";

//arigato
export interface AIService {
  generateSummary(text: string): Promise<string>;
  generateQuestions(context: string): Promise<TestQuestion[]>;
  explainAnswer(question: string): Promise<string>;
  explainDeeply(context: string): Promise<string>;
  explainConcept(concept: string): Promise<string>;
  explainInKeyPoints(context: string): Promise<string>;
}
