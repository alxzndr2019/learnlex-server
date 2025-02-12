import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { ProcessVideoUseCase } from "../../application/use-cases/process-video";
import { ProcessVideoDTO } from "../dto/process-video.dto";
import { ValidationError, InfrastructureError } from "../../core/exceptions";
import { VideoSessionRepository } from "../../application/interfaces/video-session-repository";
import { TestQuestionRepository } from "../../application/interfaces/test-question-repository";
import { VideoService } from "../../application/services/video-service";
import { UserRepository } from "../../application/interfaces/user-repository";

@injectable()
export class VideoController {
  constructor(
    private readonly processVideoUseCase: ProcessVideoUseCase,
    @inject("VideoSessionRepository")
    private readonly videoSessionRepository: VideoSessionRepository,
    @inject("TestQuestionRepository")
    private readonly testQuestionRepository: TestQuestionRepository,
    @inject("VideoService") private readonly videoService: VideoService,
    @inject("UserRepository") private readonly userRepository: UserRepository
  ) {}

  processVideo = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const dto = ProcessVideoDTO.parse({
        url: req.body.url,
        userId: req.user.id,
      });

      const result = await this.processVideoUseCase.execute(
        dto.url,
        dto.userId
      );

      res.status(201).json({
        id: result.id,
        videoId: result.videoId,
        status: result.status,
        summary: result.summary,
        questions: result.questions,
        keyPoints: result.keyPoints,
      });
    } catch (error) {
      console.error("Error processing video:", error);

      if (error instanceof ValidationError) {
        return res.status(400).json({ error: error.message });
      }
      if (error instanceof InfrastructureError) {
        return res.status(500).json({ error: error.message });
      }
      res.status(500).json({
        error: error instanceof Error ? error.message : "Internal server error",
      });
    }
  };

  getSession = async (req: Request, res: Response) => {
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
      const videoDetails = await this.videoService.getVideoDetails(
        session.videoId
      );

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
    } catch (error) {
      console.error("Error fetching session:", error);
      res.status(500).json({ error: "Failed to fetch session" });
    }
  };

  getUserSessions = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const sessions = await this.videoSessionRepository.findByUserId(
        req.user.id
      );
      const sessionsWithDetails = await Promise.all(
        sessions.map(async (session) => {
          const videoDetails = await this.videoService.getVideoDetails(
            session.videoId
          );
          return {
            id: session.id,
            title: videoDetails.title,
            thumbnailUrl: videoDetails.thumbnailUrl,
            progress: 0, // TODO: Implement progress tracking
            lastAccessed: new Date(),
          };
        })
      );

      res.json({
        sessions: sessionsWithDetails,
      });
    } catch (error) {
      console.error("Error fetching user sessions:", error);
      res.status(500).json({ error: "Failed to fetch sessions" });
    }
  };

  startTest = async (req: Request, res: Response) => {
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
    } catch (error) {
      console.error("Error starting test:", error);
      res.status(500).json({ error: "Failed to start test" });
    }
  };

  submitAnswer = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { questionId, answer } = req.body;
      const question = await this.testQuestionRepository.findById(questionId);

      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }

      const session = await this.videoSessionRepository.findById(
        question.sessionId
      );
      if (session?.userId !== req.user.id) {
        return res.status(403).json({ error: "Unauthorized access" });
      }

      const isCorrect = answer === question.correctAnswer;
      await this.testQuestionRepository.saveAnswer(
        questionId,
        answer,
        isCorrect
      );

      res.json({
        correct: isCorrect,
        explanation: question.explanation,
        correctAnswer: question.correctAnswer,
      });
    } catch (error) {
      console.error("Error submitting answer:", error);
      res.status(500).json({ error: "Failed to submit answer" });
    }
  };

  getTestResults = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const sessionId = req.params.id;
      const session = await this.videoSessionRepository.findById(sessionId);

      if (!session || session.userId !== req.user.id) {
        return res.status(403).json({ error: "Unauthorized access" });
      }

      const results = await this.testQuestionRepository.getTestResults(
        sessionId
      );

      res.json({
        score: results.score,
        totalQuestions: results.totalQuestions,
        completedAt: results.completedAt,
        answers: results.answers,
      });
    } catch (error) {
      console.error("Error fetching test results:", error);
      res.status(500).json({ error: "Failed to fetch test results" });
    }
  };

  updateProgress = async (req: Request, res: Response) => {
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
    } catch (error) {
      console.error("Error updating progress:", error);
      res.status(500).json({ error: "Failed to update progress" });
    }
  };
}
