import { Schema, mongoose } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    resetCode: {
      type: String,
    },
  },
  { timestamps: true }
);
export const User = mongoose.model("User", userSchema);
