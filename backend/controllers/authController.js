import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import { User } from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const SALT_ROUNDS = 10;

// Never leak the password hash to the client.
const sanitizeUser = (user) => ({
  id: user.id,
  name: user.fullName,
  email: user.email,
});

const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: errors.array()[0].msg,
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
    return false;
  }
  return true;
};

export const register = asyncHandler(async (req, res) => {
  if (!handleValidation(req, res)) return;

  const fullName = req.body.fullName.trim();
  const email = req.body.email.trim().toLowerCase();
  const { password } = req.body;

  const existingUser = User.findByEmail(email);
  if (existingUser) {
    return res.status(409).json({ error: "این ایمیل قبلاً ثبت‌نام کرده است" });
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const user = User.create({ fullName, email, password: hashedPassword });
  const token = generateToken(user.id);

  return res.status(201).json({
    token,
    user: sanitizeUser(user),
  });
});

export const login = asyncHandler(async (req, res) => {
  if (!handleValidation(req, res)) return;

  const email = req.body.email.trim().toLowerCase();
  const { password } = req.body;

  const user = User.findByEmail(email);
  if (!user) {
    return res.status(401).json({ error: "ایمیل یا رمز عبور اشتباه است" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "ایمیل یا رمز عبور اشتباه است" });
  }

  const token = generateToken(user.id);

  return res.status(200).json({
    token,
    user: sanitizeUser(user),
  });
});

export const getMe = asyncHandler(async (req, res) => {
  // req.user is attached by the `protect` middleware.
  return res.status(200).json({ user: sanitizeUser(req.user) });
});
