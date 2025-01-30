import { VideoSession } from "../../core/entities/video-session";

export interface VideoSessionRepository {
  createSession(
    session: Omit<VideoSession, "id" | "createdAt">
  ): Promise<VideoSession>;
  findById(id: string): Promise<VideoSession | null>;
  updateSession(
    id: string,
    updates: Partial<VideoSession>
  ): Promise<VideoSession>;
}
