import { User } from "../../core/entities/user";

export interface UserRepository {
  findByGoogleId(googleId: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  createUser(user: Omit<User, "id" | "createdAt">): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
}
