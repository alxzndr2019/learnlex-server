import { injectable } from "tsyringe";
import { UserRepository } from "../../../../application/interfaces/user-repository";
import { User } from "../../../../core/entities/user";
import { UserModel } from "../models/user";

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

  private toDomainEntity(doc: any): User {
    return new User(
      doc._id.toString(),
      doc.email,
      doc.name,
      doc.picture,
      doc.googleId,
      doc.tokens,
      doc.completedSessions.map((id: any) => id.toString()),
      doc.createdAt
    );
  }
}
