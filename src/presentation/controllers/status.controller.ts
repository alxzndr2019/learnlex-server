import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { config } from "../../config";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

@injectable()
export class StatusController {
  constructor(
    @inject("AIService") private readonly aiService: any,
    @inject("YoutubeService") private readonly youtubeService: any
  ) {}

  checkStatus = async (_req: Request, res: Response): Promise<void> => {
    const status = {
      mongodb: {
        configured: Boolean(config.mongoUri),
        status: "checking...",
      },
      openai: {
        configured: Boolean(config.openaiKey),
        status: "checking...",
      },
      youtube: {
        configured: Boolean(config.youtube.apiKey),
        status: "checking...",
      },
      google: {
        configured: Boolean(
          config.google.clientId &&
            config.google.clientSecret &&
            config.google.redirectUri
        ),
        status: "checking...",
      },
      jwt: {
        configured: Boolean(config.jwt.secret),
        status: "checking...",
      },
      client: {
        configured: Boolean(config.clientUrl),
        status: "checking...",
      },
    };

    // Check MongoDB connection
    try {
      const mongoose = require("mongoose");
      if (mongoose.connection.readyState === 1) {
        status.mongodb.status = "connected";
      } else {
        status.mongodb.status = "disconnected";
      }
    } catch (error) {
      status.mongodb.status = "error";
    }

    // Check OpenAI connection
    try {
      await this.aiService.generateSummary("test connection");
      status.openai.status = "connected";
    } catch (error) {
      status.openai.status =
        "error: " + (error instanceof Error ? error.message : "unknown error");
    }

    // Check YouTube API
    try {
      await this.youtubeService.getVideoDetails("dQw4w9WgXcQ");
      status.youtube.status = "connected";
    } catch (error) {
      status.youtube.status =
        "error: " + (error instanceof Error ? error.message : "unknown error");
    }

    // Check Google OAuth
    try {
      const oauth2Client = new OAuth2Client(
        config.google.clientId,
        config.google.clientSecret,
        config.google.redirectUri
      );
      const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: ["profile", "email"],
      });
      status.google.status = url ? "configured" : "error";
    } catch (error) {
      status.google.status =
        "error: " + (error instanceof Error ? error.message : "unknown error");
    }

    // Check JWT
    try {
      jwt.sign({ test: true }, config.jwt.secret);
      status.jwt.status = "configured";
    } catch (error) {
      status.jwt.status =
        "error: " + (error instanceof Error ? error.message : "unknown error");
    }

    // Check Client URL
    try {
      const url = new URL(config.clientUrl);
      status.client.status = "configured";
    } catch (error) {
      status.client.status = "error: invalid URL";
    }

    res.json({
      status: "operational",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      services: status,
      version: process.env.npm_package_version || "unknown",
    });
  };
}
