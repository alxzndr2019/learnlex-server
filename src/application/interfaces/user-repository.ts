import { User } from "../../core/entities/user";

export interface TokenUsage {
  date: Date;
  amount: number;
  action: "purchase" | "spend";
}

export interface UserRepository {
  findByGoogleId(googleId: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  createUser(user: Omit<User, "id" | "createdAt">): Promise<User>;
  updateUser(id: string, update: Partial<User>): Promise<User>;
  getTokenUsage(userId: string): Promise<TokenUsage[]>;
  recordTokenPurchase(
    userId: string,
    amount: number,
    cost: number
  ): Promise<void>;
}
