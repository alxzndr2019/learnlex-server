"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(id, email, name, picture, googleId, stripeCustomerId, tokens = 5, completedSessions = [], createdAt = new Date()) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.picture = picture;
        this.googleId = googleId;
        this.stripeCustomerId = stripeCustomerId;
        this.tokens = tokens;
        this.completedSessions = completedSessions;
        this.createdAt = createdAt;
    }
}
exports.User = User;
