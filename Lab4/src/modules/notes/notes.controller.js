import { Note } from "../../../DB/models/notes.model.js";
import { User } from "../../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const createNote = asyncHandler(async (req, res, next) => {
  const note = await Note.create({
    title: req.body.title,
    content: req.body.content,
    user: req.user._id,
  });
  if (!note) {
    return next(new Error("Failed to create note"));
  }
  await note.populate("user", "-password -__v");
  res.status(201).json({
    status: "success",
    data: {
      note,
    },
  });
});

export const getNotes = asyncHandler(async (req, res, next) => {
  const notes = await Note.find();
  if (!notes) {
    return next(new Error("No notes found"));
  }
  res.status(200).json({
    status: "success",
    data: {
      notes,
    },
  });
});

export const getNote = asyncHandler(async (req, res, next) => {
  const note = await Note.findById(req.params.id);
  if (!note) {
    return next(new Error("Note not found"));
  }
  res.status(200).json({
    status: "success",
    data: {
      note,
    },
  });
});

export const updateNote = asyncHandler(async (req, res, next) => {
  const note = await Note.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      content: req.body.content,
      updatedBy: req.user._id,
      updatedAt: Date.now(),
    },
    { new: true }
  );
  if (!note) {
    return next(new Error("Failed to update note"));
  }
  res.status(200).json({
    status: "success",
    data: {
      note,
    },
  });
});

export const deleteNote = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (user.role !== "admin") {
    return next(new Error("You are not authorized to delete this note"));
  }
  const note = await Note.findByIdAndDelete(req.params.id);
  if (!note) {
    return next(new Error("Failed to delete note"));
  }
  res.status(204).json({
    status: "success",
    data: "note deleted successfully",
  });
});
