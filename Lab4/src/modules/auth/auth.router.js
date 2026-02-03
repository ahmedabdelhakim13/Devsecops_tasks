import { Router } from "express";
import * as controller from "./auth.controller.js";
import { validation } from "../../middleware/validation.middleware.js";
import {
  regSchema,
  logSchema,
  resetSchema,
  newPasswordSchema,
} from "./auth.schema.js";
import { auth } from "../../middleware/auth.middleware.js";
const router = Router();

router.post("/login", validation(logSchema), controller.login);
router.get("/logout", auth, controller.logout);
router.post("/register", validation(regSchema), controller.register);

router.patch("/reset-code", validation(resetSchema), controller.resetCode);
router.patch(
  "/reset-password",
  validation(newPasswordSchema),
  controller.newPassword
);

export default router;
