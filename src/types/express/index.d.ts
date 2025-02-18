export {};

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      name: string;
      picture: string;
      tokens: number;
      role: string;
    }

    interface Request {
      user?: User;
    }
  }
}
