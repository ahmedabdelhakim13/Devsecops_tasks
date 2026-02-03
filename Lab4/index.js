import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./DB/connection.js";
import authRouter from "./src/modules/auth/auth.router.js";
import notesRouter from "./src/modules/notes/notes.router.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

app.use("/auth", authRouter);
app.use("/notes", notesRouter);

app.use("/", (req, res) => {
  res.send("Welcome to ABS");
});

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
