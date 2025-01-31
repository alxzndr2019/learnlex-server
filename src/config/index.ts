import dotenv from "dotenv";

dotenv.config();

export const config = {
  mongoUri: process.env.MONGO_URI ?? "",
  openaiKey: process.env.OPENAI_KEY ?? "",
  youtube: {
    apiKey: process.env.YOUTUBE_API_KEY ?? "",
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID ?? "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    redirectUri: process.env.GOOGLE_REDIRECT_URI ?? "",
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? "",
  },
  clientUrl: process.env.CLIENT_URL ?? "",
};
