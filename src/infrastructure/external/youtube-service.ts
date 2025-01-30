import { injectable } from "tsyringe";
import { YoutubeService } from "../../application/interfaces/youtube-service";
import { YoutubeTranscript } from "youtube-transcript";

@injectable()
export class YoutubeApiService implements YoutubeService {
  extractVideoId(url: string): string {
    const regex = /(?:v=|\/)([a-zA-Z0-9_-]{11})(?:&|$|\/|#)/;
    const match = url.match(regex);
    if (!match) throw new Error("Invalid YouTube URL");
    return match[1];
  }

  async getTranscript(videoId: string): Promise<string> {
    try {
      const transcripts = await YoutubeTranscript.fetchTranscript(videoId);
      return transcripts.map((t: any) => t.text).join(" ");
    } catch (error) {
      throw new Error(
        `Failed to fetch transcript: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async getVideoDetails(videoId: string): Promise<any> {
    // Implement video details fetching logic
    return {};
  }
}
