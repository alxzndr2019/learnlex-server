export interface VideoService {
  processVideo(url: string, userId: string): Promise<any>;
  getVideoDetails(videoId: string): Promise<any>;
  getVideoTranscript(videoId: string): Promise<string>;
}
