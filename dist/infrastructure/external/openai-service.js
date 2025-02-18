"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIService = void 0;
const tsyringe_1 = require("tsyringe");
const openai_1 = require("openai");
let OpenAIService = class OpenAIService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.openai = new openai_1.OpenAI({ apiKey });
    }
    async generateSummary(text) {
        const completion = await this.openai.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: `Summarize this video transcript in key points: ${text}
          Language: English`,
                },
            ],
            model: "gpt-3.5-turbo",
        });
        return completion.choices[0].message.content || "No summary available";
    }
    async generateQuestions(context) {
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
            const content = response.choices[0].message.content || "[]";
            // Remove any markdown code block formatting if present
            const cleanContent = content
                .replace(/```json\n?/g, "")
                .replace(/```\n?/g, "")
                .replace(/\n/g, "")
                .trim();
            return JSON.parse(cleanContent);
        }
        catch (error) {
            console.error("Error generating questions:", error);
            return [];
        }
    }
    async explainAnswer(question) {
        // Implement answer explanation logic
        return "";
    }
    async explainDeeply(context) {
        const prompt = `Explain this deeply
    Context: ${context}
    Format: JSON array with question, choices, answer (index), explanation
    Language: English`;
        const response = await this.openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
        });
        return response.choices[0].message.content || " ";
    }
    async explainConcept(concept) {
        const prompt = `Explain the concept behind this
    Context: ${concept}
    Format: JSON array with question, choices, answer (index), explanation
    Language: English`;
        const response = await this.openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        });
        return response.choices[0].message.content || " ";
    }
    async explainInKeyPoints(context) {
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
            const content = response.choices[0].message.content || "[]";
            // Remove any markdown code block formatting if present
            const cleanContent = content
                .replace(/json\n?/g, "")
                .replace(/\n?/g, "")
                .trim();
            return JSON.parse(cleanContent);
        }
        catch (error) {
            console.error("Error parsing key points:", error);
            return "Failed to generate key points";
        }
    }
};
exports.OpenAIService = OpenAIService;
exports.OpenAIService = OpenAIService = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [String])
], OpenAIService);
