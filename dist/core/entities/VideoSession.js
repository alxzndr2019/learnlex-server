"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoSession = void 0;
class VideoSession {
    constructor(id, userId, videoId, title, channelTitle, thumbnailUrl, duration, summary, status, createdAt, completedAt, questions, keyPoints, progress = 0, lastAccessed = new Date()) {
        this.id = id;
        this.userId = userId;
        this.videoId = videoId;
        this.title = title;
        this.channelTitle = channelTitle;
        this.thumbnailUrl = thumbnailUrl;
        this.duration = duration;
        this.summary = summary;
        this.status = status;
        this.createdAt = createdAt;
        this.completedAt = completedAt;
        this.questions = questions;
        this.keyPoints = keyPoints;
        this.progress = progress;
        this.lastAccessed = lastAccessed;
    }
}
exports.VideoSession = VideoSession;
