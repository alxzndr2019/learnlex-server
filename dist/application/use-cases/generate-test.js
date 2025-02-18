"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateTestUseCase = void 0;
class GenerateTestUseCase {
    constructor(aiService, videoRepo, testRepo) {
        this.aiService = aiService;
        this.videoRepo = videoRepo;
        this.testRepo = testRepo;
    }
    async execute(sessionId) {
        const { questions } = await this.testRepo.createTest(sessionId);
        return questions;
    }
}
exports.GenerateTestUseCase = GenerateTestUseCase;
