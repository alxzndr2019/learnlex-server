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
exports.ProcessVideoUseCase = void 0;
// application/use-cases/process-video.ts
const tsyringe_1 = require("tsyringe");
let ProcessVideoUseCase = class ProcessVideoUseCase {
    constructor(youtubeService, aiService, videoSessionRepository) {
        this.youtubeService = youtubeService;
        this.aiService = aiService;
        this.videoSessionRepository = videoSessionRepository;
    }
    async execute(videoUrl, userId) {
        // 1. Validate URL
        const videoId = this.youtubeService.extractVideoId(videoUrl);
        // 2. Get Transcript
        const transcript = await this.youtubeService.getTranscript(videoId);
        // 3. Generate Summary
        const summary = await this.aiService.generateSummary(transcript);
        const questions = await this.aiService.generateQuestions(summary);
        const keyPoints = await this.aiService.explainInKeyPoints(transcript);
        // const concept = await this.aiService.explainConcept(transcript);
        // const deeply = await this.aiService.explainDeeply(transcript);
        // 4. Create Session
        return this.videoSessionRepository.createSession({
            userId,
            videoId,
            summary,
            questions,
            keyPoints,
            //   concept,
            //   deeply,
            status: "ready",
        });
    }
};
exports.ProcessVideoUseCase = ProcessVideoUseCase;
exports.ProcessVideoUseCase = ProcessVideoUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("YoutubeService")),
    __param(1, (0, tsyringe_1.inject)("AIService")),
    __param(2, (0, tsyringe_1.inject)("VideoSessionRepository")),
    __metadata("design:paramtypes", [Object, Object, Object])
], ProcessVideoUseCase);
