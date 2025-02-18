"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoTestQuestionRepository = void 0;
const tsyringe_1 = require("tsyringe");
let MongoTestQuestionRepository = class MongoTestQuestionRepository {
    async createTest(sessionId) {
        // TODO: Implement test creation logic
        return { id: sessionId, questions: [] };
    }
    async findById(id) {
        // TODO: Implement find by id logic
        return null;
    }
    async findBySessionId(sessionId) {
        // TODO: Implement find by session id logic
        return [];
    }
    async saveAnswer(questionId, answer, isCorrect) {
        // TODO: Implement save answer logic
    }
    async getTestResults(sessionId) {
        // TODO: Implement get test results logic
        return {
            score: 0,
            totalQuestions: 0,
            completedAt: new Date(),
            answers: [],
        };
    }
};
exports.MongoTestQuestionRepository = MongoTestQuestionRepository;
exports.MongoTestQuestionRepository = MongoTestQuestionRepository = __decorate([
    (0, tsyringe_1.injectable)()
], MongoTestQuestionRepository);
