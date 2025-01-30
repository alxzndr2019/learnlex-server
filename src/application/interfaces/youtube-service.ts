import { VideoDetails } from "../../core/entities/VideoDetails";

export interface YoutubeService {
  extractVideoId(url: string): string;
  getTranscript(videoId: string): Promise<string>;
  getVideoDetails(videoId: string): Promise<VideoDetails>;
}
