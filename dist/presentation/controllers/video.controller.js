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
exports.VideoController = void 0;
const tsyringe_1 = require("tsyringe");
const process_video_1 = require("../../application/use-cases/process-video");
const process_video_dto_1 = require("../dto/process-video.dto");
const exceptions_1 = require("../../core/exceptions");
let VideoController = class VideoController {
    constructor(processVideoUseCase, videoSessionRepository, testQuestionRepository, videoService, userRepository) {
        this.processVideoUseCase = processVideoUseCase;
        this.videoSessionRepository = videoSessionRepository;
        this.testQuestionRepository = testQuestionRepository;
        this.videoService = videoService;
        this.userRepository = userRepository;
        this.processVideo = async (req, res) => {
            try {
                if (!req.user) {
                    return res.status(401).json({ error: "Unauthorized" });
                }
                const dto = process_video_dto_1.ProcessVideoDTO.parse({
                    url: req.body.url,
                    userId: req.user.id,
                });
                const result = await this.processVideoUseCase.execute(dto.url, dto.userId);
                res.status(201).json({
                    id: result.id,
                    videoId: result.videoId,
                    status: result.status,
                    summary: result.summary,
                    questions: result.questions,
                    keyPoints: result.keyPoints,
                });
            }
            catch (error) {
                console.error("Error processing video:", error);
                if (error instanceof exceptions_1.ValidationError) {
                    return res.status(400).json({ error: error.message });
                }
                if (error instanceof exceptions_1.InfrastructureError) {
                    return res.status(500).json({ error: error.message });
                }
                res.status(500).json({
                    error: error instanceof Error ? error.message : "Internal server error",
                });
            }
        };
        this.getSession = async (req, res) => {
            try {
                if (!req.user) {
                    return res.status(401).json({ error: "Unauthorized" });
                }
                const sessionId = req.params.id;
                const session = await this.videoSessionRepository.findById(sessionId);
                if (!session) {
                    return res.status(404).json({ error: "Session not found" });
                }
                if (session.userId !== req.user.id) {
                    return res.status(403).json({ error: "Unauthorized access" });
                }
                // Get video details from video service
                const videoDetails = await this.videoService.getVideoDetails(session.videoId);
                res.json({
                    id: session.id,
                    videoId: session.videoId,
                    title: videoDetails.title,
                    channelTitle: videoDetails.channelTitle,
                    thumbnailUrl: videoDetails.thumbnailUrl,
                    duration: videoDetails.duration,
                    status: session.status,
                    summary: session.summary,
                    keyPoints: session.keyPoints,
                    progress: 0, // TODO: Implement progress tracking
                    lastAccessed: new Date(),
                });
            }
            catch (error) {
                console.error("Error fetching session:", error);
                res.status(500).json({ error: "Failed to fetch session" });
            }
        };
        this.getUserSessions = async (req, res) => {
            try {
                if (!req.user) {
                    return res.status(401).json({ error: "Unauthorized" });
                }
                const sessions = await this.videoSessionRepository.findByUserId(req.user.id);
                const sessionsWithDetails = await Promise.all(sessions.map(async (session) => {
                    const videoDetails = await this.videoService.getVideoDetails(session.videoId);
                    return {
                        id: session.id,
                        title: videoDetails.title,
                        thumbnailUrl: videoDetails.thumbnailUrl,
                        progress: 0, // TODO: Implement progress tracking
                        lastAccessed: new Date(),
                    };
                }));
                res.json({
                    sessions: sessionsWithDetails,
                });
            }
            catch (error) {
                console.error("Error fetching user sessions:", error);
                res.status(500).json({ error: "Failed to fetch sessions" });
            }
        };
        this.startTest = async (req, res) => {
            try {
                if (!req.user) {
                    return res.status(401).json({ error: "Unauthorized" });
                }
                const sessionId = req.params.id;
                const session = await this.videoSessionRepository.findById(sessionId);
                if (!session) {
                    return res.status(404).json({ error: "Session not found" });
                }
                if (session.userId !== req.user.id) {
                    return res.status(403).json({ error: "Unauthorized access" });
                }
                // Create a new test instance
                const test = await this.testQuestionRepository.createTest(sessionId);
                res.json({
                    testId: test.id,
                    questions: test.questions.map((q) => ({
                        id: q.id,
                        text: q.question,
                        options: q.choices,
                    })),
                });
            }
            catch (error) {
                console.error("Error starting test:", error);
                res.status(500).json({ error: "Failed to start test" });
            }
        };
        this.submitAnswer = async (req, res) => {
            try {
                if (!req.user) {
                    return res.status(401).json({ error: "Unauthorized" });
                }
                const { questionId, answer } = req.body;
                const question = await this.testQuestionRepository.findById(questionId);
                if (!question) {
                    return res.status(404).json({ error: "Question not found" });
                }
                const session = await this.videoSessionRepository.findById(question.sessionId);
                if (session?.userId !== req.user.id) {
                    return res.status(403).json({ error: "Unauthorized access" });
                }
                const isCorrect = answer === question.correctAnswer;
                await this.testQuestionRepository.saveAnswer(questionId, answer, isCorrect);
                res.json({
                    correct: isCorrect,
                    explanation: question.explanation,
                    correctAnswer: question.correctAnswer,
                });
            }
            catch (error) {
                console.error("Error submitting answer:", error);
                res.status(500).json({ error: "Failed to submit answer" });
            }
        };
        this.getTestResults = async (req, res) => {
            try {
                if (!req.user) {
                    return res.status(401).json({ error: "Unauthorized" });
                }
                const sessionId = req.params.id;
                const session = await this.videoSessionRepository.findById(sessionId);
                if (!session || session.userId !== req.user.id) {
                    return res.status(403).json({ error: "Unauthorized access" });
                }
                const results = await this.testQuestionRepository.getTestResults(sessionId);
                res.json({
                    score: results.score,
                    totalQuestions: results.totalQuestions,
                    completedAt: results.completedAt,
                    answers: results.answers,
                });
            }
            catch (error) {
                console.error("Error fetching test results:", error);
                res.status(500).json({ error: "Failed to fetch test results" });
            }
        };
        this.updateProgress = async (req, res) => {
            try {
                if (!req.user) {
                    return res.status(401).json({ error: "Unauthorized" });
                }
                const sessionId = req.params.id;
                const { progress } = req.body;
                if (typeof progress !== "number" || progress < 0 || progress > 100) {
                    return res.status(400).json({ error: "Invalid progress value" });
                }
                const session = await this.videoSessionRepository.findById(sessionId);
                if (!session) {
                    return res.status(404).json({ error: "Session not found" });
                }
                if (session.userId !== req.user.id) {
                    return res.status(403).json({ error: "Unauthorized access" });
                }
                await this.videoSessionRepository.updateSession(sessionId, {
                    progress,
                    lastAccessed: new Date(),
                });
                res.json({ success: true });
            }
            catch (error) {
                console.error("Error updating progress:", error);
                res.status(500).json({ error: "Failed to update progress" });
            }
        };
    }
};
exports.VideoController = VideoController;
exports.VideoController = VideoController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(1, (0, tsyringe_1.inject)("VideoSessionRepository")),
    __param(2, (0, tsyringe_1.inject)("TestQuestionRepository")),
    __param(3, (0, tsyringe_1.inject)("VideoService")),
    __param(4, (0, tsyringe_1.inject)("UserRepository")),
    __metadata("design:paramtypes", [process_video_1.ProcessVideoUseCase, Object, Object, Object, Object])
], VideoController);
