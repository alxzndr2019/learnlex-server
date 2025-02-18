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
exports.DefaultVideoService = void 0;
const tsyringe_1 = require("tsyringe");
let DefaultVideoService = class DefaultVideoService {
    constructor(youtubeService, aiService, videoSessionRepository) {
        this.youtubeService = youtubeService;
        this.aiService = aiService;
        this.videoSessionRepository = videoSessionRepository;
    }
    async processVideo(url, userId) {
        const videoId = this.youtubeService.extractVideoId(url);
        const transcript = await this.youtubeService.getTranscript(videoId);
        const videoDetails = await this.youtubeService.getVideoDetails(videoId);
        const summary = await this.aiService.generateSummary(transcript);
        const questions = await this.aiService.generateQuestions(summary);
        const keyPointsText = await this.aiService.explainInKeyPoints(transcript);
        const keyPoints = keyPointsText.split("\n").filter((point) => point.trim());
        return this.videoSessionRepository.createSession({
            userId,
            videoId,
            summary,
            status: "ready",
            questions,
            keyPoints,
            progress: 0,
            lastAccessed: new Date(),
        });
    }
    async getVideoDetails(videoId) {
        return this.youtubeService.getVideoDetails(videoId);
    }
    async getVideoTranscript(videoId) {
        return this.youtubeService.getTranscript(videoId);
    }
};
exports.DefaultVideoService = DefaultVideoService;
exports.DefaultVideoService = DefaultVideoService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("YoutubeService")),
    __param(1, (0, tsyringe_1.inject)("AIService")),
    __param(2, (0, tsyringe_1.inject)("VideoSessionRepository")),
    __metadata("design:paramtypes", [Object, Object, Object])
], DefaultVideoService);
