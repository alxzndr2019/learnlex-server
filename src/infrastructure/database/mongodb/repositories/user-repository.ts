import { injectable } from "tsyringe";
import {
  UserRepository,
  TokenUsage,
} from "../../../../application/interfaces/user-repository";
import { User } from "../../../../core/entities/user";
import { UserModel } from "../models/user";
import { Document, Types } from "mongoose";

interface UserDocument extends Document {
  _id: Types.ObjectId;
  email: string;
  name: string;
  picture: string | null;
  googleId: string;
  tokens: number;
  completedSessions: Types.ObjectId[];
  tokenUsage: TokenUsage[];
  createdAt: Date;
}

@injectable()
export class MongoUserRepository implements UserRepository {
  async findByGoogleId(googleId: string): Promise<User | null> {
    const user = await UserModel.findOne({ googleId });
    return user ? this.toDomainEntity(user) : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id);
    return user ? this.toDomainEntity(user) : null;
  }

  async createUser(userData: Omit<User, "id" | "createdAt">): Promise<User> {
    const user = new UserModel(userData);
    const savedUser = await user.save();
    return this.toDomainEntity(savedUser);
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { ...updates },
      { new: true }
    );
    if (!updatedUser) throw new Error("User not found");
    return this.toDomainEntity(updatedUser);
  }

  async getTokenUsage(userId: string): Promise<TokenUsage[]> {
    const user = await UserModel.findById(userId);
    return (user?.tokenUsage || []) as TokenUsage[];
  }

  async recordTokenPurchase(
    userId: string,
    amount: number,
    cost: number
  ): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, {
      $push: {
        tokenUsage: { date: new Date(), amount, action: "purchase" as const },
      },
      $inc: { tokens: amount },
    });
  }

  private toDomainEntity(doc: any): User {
    return new User(
      doc._id.toString(),
      doc.email,
      doc.name,
      doc.picture || undefined,
      doc.googleId,
      doc.tokens,
      doc.completedSessions.map((id: any) => id.toString()),
      doc.createdAt
    );
  }
}
