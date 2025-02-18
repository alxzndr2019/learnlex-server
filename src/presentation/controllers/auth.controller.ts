import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { OAuth2Client } from "google-auth-library";
import { UserRepository } from "../../application/interfaces/user-repository";
import jwt from "jsonwebtoken";
import { config } from "../../config";

@injectable()
export class AuthController {
  private oauth2Client: OAuth2Client;

  constructor(
    @inject("UserRepository") private readonly userRepository: UserRepository
  ) {
    this.oauth2Client = new OAuth2Client(
      config.google.clientId,
      config.google.clientSecret,
      config.google.redirectUri
    );
  }

  initiateGoogleAuth = async (req: Request, res: Response): Promise<void> => {
    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ],
    });
    res.redirect(authUrl);
  };

  googleCallback = async (req: Request, res: Response): Promise<void> => {
    try {
      const { code } = req.query;
      if (!code || typeof code !== "string") {
        res.status(400).json({ error: "Invalid authorization code" });
        return;
      }

      const { tokens } = await this.oauth2Client.getToken(code);
      const ticket = await this.oauth2Client.verifyIdToken({
        idToken: tokens.id_token!,
        audience: config.google.clientId,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        res.status(400).json({ error: "No user info in token" });
        return;
      }

      let user = await this.userRepository.findByGoogleId(payload.sub);
      if (!user) {
        user = await this.userRepository.createUser({
          email: payload.email!,
          name: payload.name!,
          picture: payload.picture!,
          googleId: payload.sub,
          tokens: 5,
          role: "user",
          completedSessions: [],
          updatedAt: new Date(),
        });
      }

      // Set token as HTTP-only cookie
      const token = jwt.sign(
        { id: user.id, email: user.email },
        config.jwt.secret,
        {
          expiresIn: "7d",
        }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Redirect with user info only (token will be in cookie)
      const redirectUrl = `${
        config.clientUrl
      }/auth/callback?user=${encodeURIComponent(JSON.stringify(user))}`;

      res.redirect(redirectUrl);
    } catch (error) {
      console.log(error);
      console.error("Google auth error:", error);
      res.redirect(`${config.clientUrl}/auth/error`);
    }
  };

  getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.userRepository.findById(req.user!.id);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.json(user);
    } catch (error) {
      console.error("Get current user error:", error);
      res.status(500).json({ error: "Failed to get user info" });
    }
  };
}
