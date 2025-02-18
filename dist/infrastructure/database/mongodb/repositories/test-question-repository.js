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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoTestQuestionRepository = void 0;
const test_question_1 = require("../../../../core/entities/test-question");
const test_question_2 = require("../models/test-question");
const tsyringe_1 = require("tsyringe");
const tsyringe_2 = require("tsyringe");
let MongoTestQuestionRepository = class MongoTestQuestionRepository {
    constructor(aiService, videoSessionRepo) {
        this.aiService = aiService;
        this.videoSessionRepo = videoSessionRepo;
    }
    async createTest(sessionId) {
        // Get the session to access its summary
        const session = await this.videoSessionRepo.findById(sessionId);
        if (!session) {
            throw new Error("Session not found");
        }
        // Generate questions using AI service
        const questions = await this.aiService.generateQuestions(session.summary);
        // Save questions to database
        const savedQuestions = await Promise.all(questions.map(async (q) => {
            const question = new test_question_2.TestQuestionModel({
                sessionId,
                question: q.question,
                choices: q.choices,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation,
            });
            const saved = await question.save();
            return this.toDomainEntity(saved);
        }));
        return {
            id: sessionId, // Using session ID as test ID for simplicity
            questions: savedQuestions,
        };
    }
    async findById(id) {
        const question = await test_question_2.TestQuestionModel.findById(id);
        return question ? this.toDomainEntity(question) : null;
    }
    async findBySessionId(sessionId) {
        const questions = await test_question_2.TestQuestionModel.find({ sessionId });
        return questions.map((q) => this.toDomainEntity(q));
    }
    async saveAnswer(questionId, answer, isCorrect) {
        await test_question_2.TestQuestionModel.findByIdAndUpdate(questionId, {
            userAnswer: answer,
            isCorrect,
        });
    }
    async getTestResults(sessionId) {
        const questions = await test_question_2.TestQuestionModel.find({
            sessionId,
            userAnswer: { $exists: true },
        });
        const answers = questions.map((q) => ({
            questionId: q._id.toString(),
            answer: q.userAnswer,
            isCorrect: q.isCorrect,
        }));
        const correctAnswers = answers.filter((a) => a.isCorrect).length;
        return {
            score: (correctAnswers / questions.length) * 100,
            totalQuestions: questions.length,
            completedAt: new Date(),
            answers,
        };
    }
    toDomainEntity(doc) {
        return new test_question_1.TestQuestion(doc._id.toString(), doc.sessionId.toString(), doc.question, doc.choices, doc.correctAnswer, doc.explanation, doc.userAnswer, doc.isCorrect);
    }
};
exports.MongoTestQuestionRepository = MongoTestQuestionRepository;
exports.MongoTestQuestionRepository = MongoTestQuestionRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_2.inject)("AIService")),
    __param(1, (0, tsyringe_2.inject)("VideoSessionRepository")),
    __metadata("design:paramtypes", [Object, Object])
], MongoTestQuestionRepository);
