import { injectable } from "tsyringe";
import { VideoSessionRepository } from "../../../../application/interfaces/video-session-repository";
import { VideoSession } from "../../../../core/entities/video-session";
import { VideoSessionModel } from "../models/video-session";

@injectable()
export class MongoVideoSessionRepository implements VideoSessionRepository {
  async createSession(
    session: Omit<VideoSession, "id" | "createdAt">
  ): Promise<VideoSession> {
    const newSession = new VideoSessionModel({
      ...session,
      status: "ready",
    });

    const savedSession = await newSession.save();
    return this.toDomainEntity(savedSession);
  }

  async findById(id: string): Promise<VideoSession | null> {
    const session = await VideoSessionModel.findById(id);
    return session ? this.toDomainEntity(session) : null;
  }

  async updateSession(
    id: string,
    updates: Partial<VideoSession>
  ): Promise<VideoSession> {
    const updatedSession = await VideoSessionModel.findByIdAndUpdate(
      id,
      { ...updates },
      { new: true }
    );

    if (!updatedSession) throw new Error("Session not found");
    return this.toDomainEntity(updatedSession);
  }

  private toDomainEntity(doc: any): VideoSession {
    return new VideoSession(
      doc._id.toString(),
      doc.userId,
      doc.videoId,
      doc.summary,
      doc.status,
      doc.createdAt,
      doc.completedAt,
      doc.questions,
      doc.keyPoints
    );
  }
}
