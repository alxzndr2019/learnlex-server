"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YoutubeApiService = void 0;
const tsyringe_1 = require("tsyringe");
const youtube_transcript_1 = require("youtube-transcript");
let YoutubeApiService = class YoutubeApiService {
    extractVideoId(url) {
        const regex = /(?:v=|\/)([a-zA-Z0-9_-]{11})(?:&|$|\/|#)/;
        const match = url.match(regex);
        if (!match)
            throw new Error("Invalid YouTube URL");
        return match[1];
    }
    async getTranscript(videoId) {
        try {
            const transcripts = await youtube_transcript_1.YoutubeTranscript.fetchTranscript(videoId);
            return transcripts.map((t) => t.text).join(" ");
        }
        catch (error) {
            throw new Error(`Failed to fetch transcript: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    async getVideoDetails(videoId) {
        // Implement video details fetching logic
        return {};
    }
};
exports.YoutubeApiService = YoutubeApiService;
exports.YoutubeApiService = YoutubeApiService = __decorate([
    (0, tsyringe_1.injectable)()
], YoutubeApiService);
