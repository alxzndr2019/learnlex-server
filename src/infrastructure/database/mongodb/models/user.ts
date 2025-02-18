import mongoose from "mongoose";

const tokenUsageSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  action: { type: String, enum: ["purchase", "spend"], required: true },
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  picture: { type: String },
  googleId: { type: String, required: true, unique: true },
  tokens: { type: Number, default: 5 },
  completedSessions: [
    { type: mongoose.Schema.Types.ObjectId, ref: "VideoSession" },
  ],
  tokenUsage: [tokenUsageSchema],
  createdAt: { type: Date, default: Date.now },
});

export const UserModel = mongoose.model("User", userSchema);
