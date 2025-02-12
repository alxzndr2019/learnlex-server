import { UserDocument } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        email: string;
        name: string;
        picture: string;
        tokens: number;
      };
    }
  }
}
