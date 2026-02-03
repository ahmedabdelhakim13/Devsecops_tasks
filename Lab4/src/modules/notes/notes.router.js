import { Router } from "express";
import * as controller from "./notes.controller.js";
import { auth } from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/", auth, controller.createNote);
router.get("/", auth, controller.getNotes);
router.get("/:id", auth, controller.getNote);
router.patch("/:id", auth, controller.updateNote);
router.delete("/:id", auth, controller.deleteNote);

export default router;
