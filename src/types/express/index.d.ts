declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      email: string;
      name: string;
      picture?: string;
      tokens: number;
      stripeCustomerId?: string;
    };
  }
}
