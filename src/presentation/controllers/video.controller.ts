import { Request, Response } from "express";
import { injectable } from "tsyringe";
import { ProcessVideoUseCase } from "../../application/use-cases/process-video";
import { ProcessVideoDTO } from "../dto/process-video.dto";
import { ValidationError, InfrastructureError } from "../../core/exceptions";

@injectable()
export class VideoController {
  constructor(private readonly processVideoUseCase: ProcessVideoUseCase) {}

  processVideo = async (req: Request, res: Response) => {
    try {
      const dto = ProcessVideoDTO.parse({
        url: req.body.url,
        userId: req.body.userId,
      });

      const result = await this.processVideoUseCase.execute(
        dto.url,
        dto.userId
      );
      console.log(result);
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
}
