import { Router } from "express";
import asyncHandler from "express-async-handler";
import {
  login,
  register,
  validateRegister,
  validateLogin,
} from "../controllers/auth.controller.js";
import rateLimit from "express-rate-limit";

const router = Router();

const loginLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many login attempts, please try again later.",
});

router.post("/register", validateRegister, asyncHandler(register));
router.post("/login", loginLimit, validateLogin, asyncHandler(login));

export default router;
