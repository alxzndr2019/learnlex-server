import { injectable } from "tsyringe";
import OpenAI from "openai";
import { AIService } from "../../application/interfaces/ai-service";
import { TestQuestion } from "../../core/entities/test-question";
import { config } from "../../config";

@injectable()
export class OpenAIService implements AIService {
  private readonly openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: config.openaiKey,
    });
  }

  async generateSummary(text: string): Promise<string> {
    const completion = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Summarize this video transcript in key points: ${text}
          Language: English`,
        },
      ],
    });

    return completion.choices[0].message?.content || "No summary available";
  }

  async generateQuestions(context: string): Promise<TestQuestion[]> {
    const prompt = `Generate 5 multiple choice questions with explanations.
    Context: ${context}
    Format: JSON array with question, choices, answer (index), explanation
    Language: English
    Return ONLY a valid JSON array, with no markdown formatting or additional text.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      });

      const content = response.choices[0].message?.content || "[]";
      // Remove any markdown code block formatting if present
      const cleanContent = content
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .replace(/\n/g, "")
        .trim();

      return JSON.parse(cleanContent);
    } catch (error) {
      console.error("Error generating questions:", error);
      return [];
    }
  }

  async explainAnswer(question: string): Promise<string> {
    // Implement answer explanation logic

    return "";
  }

  async explainDeeply(context: string): Promise<string> {
    const prompt = `Explain this deeply
    Context: ${context}
    Format: JSON array with question, choices, answer (index), explanation
    Language: English`;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0].message?.content || " ";
  }

  async explainConcept(concept: string): Promise<string> {
    const prompt = `Explain the concept behind this
    Context: ${concept}
    Format: JSON array with question, choices, answer (index), explanation
    Language: English`;

    const response = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0].message?.content || " ";
  }

  async explainInKeyPoints(context: string): Promise<string> {
    const prompt = `Generate 10 key points explaining the following context. Return them in a JSON array format.
    Context: ${context}
    
    Return ONLY a valid JSON array of strings, each containing one key point.
    Example format: ["Point 1", "Point 2", "Point 3"]
    Language: English`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      });
      const content = response.choices[0].message?.content || "[]";
      // Remove any markdown code block formatting if present
      const cleanContent = content
        .replace(/json\n?/g, "")
        .replace(/\n?/g, "")
        .trim();
      return JSON.parse(cleanContent);
    } catch (error) {
      console.error("Error parsing key points:", error);
      return "Failed to generate key points";
    }
  }
}
