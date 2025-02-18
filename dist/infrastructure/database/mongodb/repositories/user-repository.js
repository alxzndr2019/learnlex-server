"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoUserRepository = void 0;
const tsyringe_1 = require("tsyringe");
const user_1 = require("../../../../core/entities/user");
const user_2 = require("../models/user");
let MongoUserRepository = class MongoUserRepository {
    async findByGoogleId(googleId) {
        const user = await user_2.UserModel.findOne({ googleId });
        return user ? this.toDomainEntity(user) : null;
    }
    async findById(id) {
        const user = await user_2.UserModel.findById(id);
        return user ? this.toDomainEntity(user) : null;
    }
    async createUser(userData) {
        const user = new user_2.UserModel(userData);
        const savedUser = await user.save();
        return this.toDomainEntity(savedUser);
    }
    async updateUser(id, updates) {
        const updatedUser = await user_2.UserModel.findByIdAndUpdate(id, { ...updates }, { new: true });
        if (!updatedUser)
            throw new Error("User not found");
        return this.toDomainEntity(updatedUser);
    }
    async getTokenUsage(userId) {
        const user = await user_2.UserModel.findById(userId);
        return (user?.tokenUsage || []);
    }
    async recordTokenPurchase(userId, amount, cost) {
        await user_2.UserModel.findByIdAndUpdate(userId, {
            $push: {
                tokenUsage: { date: new Date(), amount, action: "purchase" },
            },
            $inc: { tokens: amount },
        });
    }
    toDomainEntity(doc) {
        return new user_1.User(doc._id.toString(), doc.email, doc.name, doc.picture || undefined, doc.googleId, doc.tokens, doc.completedSessions.map((id) => id.toString()), doc.createdAt);
    }
};
exports.MongoUserRepository = MongoUserRepository;
exports.MongoUserRepository = MongoUserRepository = __decorate([
    (0, tsyringe_1.injectable)()
], MongoUserRepository);
