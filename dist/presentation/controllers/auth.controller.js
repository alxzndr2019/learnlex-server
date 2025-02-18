"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const tsyringe_1 = require("tsyringe");
const google_auth_library_1 = require("google-auth-library");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../config");
let AuthController = class AuthController {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.initiateGoogleAuth = async (req, res) => {
            const authUrl = this.oauth2Client.generateAuthUrl({
                access_type: "offline",
                scope: [
                    "https://www.googleapis.com/auth/userinfo.profile",
                    "https://www.googleapis.com/auth/userinfo.email",
                ],
            });
            res.redirect(authUrl);
        };
        this.googleCallback = async (req, res) => {
            try {
                const { code } = req.query;
                if (!code || typeof code !== "string") {
                    res.status(400).json({ error: "Invalid authorization code" });
                    return;
                }
                const { tokens } = await this.oauth2Client.getToken(code);
                const ticket = await this.oauth2Client.verifyIdToken({
                    idToken: tokens.id_token,
                    audience: config_1.config.google.clientId,
                });
                const payload = ticket.getPayload();
                if (!payload) {
                    res.status(400).json({ error: "No user info in token" });
                    return;
                }
                let user = await this.userRepository.findByGoogleId(payload.sub);
                if (!user) {
                    user = await this.userRepository.createUser({
                        email: payload.email,
                        name: payload.name,
                        picture: payload.picture,
                        googleId: payload.sub,
                        tokens: 5,
                        completedSessions: [],
                    });
                }
                // Set token as HTTP-only cookie
                const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, config_1.config.jwt.secret, {
                    expiresIn: "7d",
                });
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                });
                // Redirect with user info only (token will be in cookie)
                const redirectUrl = `${config_1.config.clientUrl}/auth/callback?user=${encodeURIComponent(JSON.stringify(user))}`;
                res.redirect(redirectUrl);
            }
            catch (error) {
                console.error("Google auth error:", error);
                res.redirect(`${config_1.config.clientUrl}/auth/error`);
            }
        };
        this.getCurrentUser = async (req, res) => {
            try {
                const user = await this.userRepository.findById(req.user.id);
                if (!user) {
                    res.status(404).json({ error: "User not found" });
                    return;
                }
                res.json(user);
            }
            catch (error) {
                console.error("Get current user error:", error);
                res.status(500).json({ error: "Failed to get user info" });
            }
        };
        this.oauth2Client = new google_auth_library_1.OAuth2Client(config_1.config.google.clientId, config_1.config.google.clientSecret, config_1.config.google.redirectUri);
    }
};
exports.AuthController = AuthController;
exports.AuthController = AuthController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("UserRepository")),
    __metadata("design:paramtypes", [Object])
], AuthController);
