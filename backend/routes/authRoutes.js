import { Router } from "express";
import { register, login, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { registerValidation, loginValidation } from "../utils/validators.js";

const router = Router();

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);

// Protected: requires a valid JWT. Useful for restoring a session on
// page refresh from the frontend.
router.get("/me", protect, getMe);

export default router;
