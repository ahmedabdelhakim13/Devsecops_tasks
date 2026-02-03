import { Schema, Types, mongoose } from "mongoose";

const tokenSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    expiredAt: {
      type: Date,
      required: true,
      default: Date.now() + 1000 * 60 * 60 * 24 * 7,
    },
  },
  { timestamps: true }
);
export const Token = mongoose.model("Token", tokenSchema);
