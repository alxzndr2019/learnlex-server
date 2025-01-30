import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  picture: { type: String },
  googleId: { type: String, required: true, unique: true },
  tokens: { type: Number, default: 5 },
  completedSessions: [
    { type: mongoose.Schema.Types.ObjectId, ref: "VideoSession" },
  ],
  createdAt: { type: Date, default: Date.now },
});

export const UserModel = mongoose.model("User", userSchema);
