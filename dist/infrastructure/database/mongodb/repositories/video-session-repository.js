"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoVideoSessionRepository = void 0;
const tsyringe_1 = require("tsyringe");
const video_session_1 = require("../../../../core/entities/video-session");
const video_session_2 = require("../models/video-session");
let MongoVideoSessionRepository = class MongoVideoSessionRepository {
    async createSession(session) {
        const newSession = new video_session_2.VideoSessionModel({
            ...session,
            status: "ready",
        });
        const savedSession = await newSession.save();
        return this.toDomainEntity(savedSession);
    }
    async findById(id) {
        const session = await video_session_2.VideoSessionModel.findById(id);
        return session ? this.toDomainEntity(session) : null;
    }
    async findByUserId(userId) {
        const sessions = await video_session_2.VideoSessionModel.find({ userId }).sort({
            lastAccessed: -1,
        });
        return sessions.map((session) => this.toDomainEntity(session));
    }
    async updateSession(id, updates) {
        const updatedSession = await video_session_2.VideoSessionModel.findByIdAndUpdate(id, { ...updates }, { new: true });
        if (!updatedSession)
            throw new Error("Session not found");
        return this.toDomainEntity(updatedSession);
    }
    async deleteSession(id) {
        await video_session_2.VideoSessionModel.findByIdAndDelete(id);
    }
    toDomainEntity(doc) {
        return new video_session_1.VideoSession(doc._id.toString(), doc.userId, doc.videoId, doc.summary, doc.status, doc.createdAt, doc.completedAt, doc.questions, doc.keyPoints, doc.progress, doc.lastAccessed);
    }
};
exports.MongoVideoSessionRepository = MongoVideoSessionRepository;
exports.MongoVideoSessionRepository = MongoVideoSessionRepository = __decorate([
    (0, tsyringe_1.injectable)()
], MongoVideoSessionRepository);
