import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";

export const validateRegister = [
  body("email").isEmail().normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("fullName")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Full name is required"),
  body("phoneNumber")
    .isMobilePhone()
    .withMessage("Valid phone number is required"),
  body("address")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Address is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }
    next();
  },
];

export const validateLogin = [
  body("email").isEmail().normalizeEmail(),
  body("password").exists().withMessage("Password is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }
    next();
  },
];

const register = async (req, res) => {
  const { fullName, email, password, address, phoneNumber } = req.body;
  let role = req.body.role;

  if (!role) {
    role = "customer";
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must contain uppercase, lowercase, number, and special character, minimum 8 characters",
    });
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { phoneNumber }],
  });

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    fullName,
    email,
    password: hashPassword,
    address,
    phoneNumber,
    role,
  });

  const token = jwt.sign(
    {
      id: newUser._id,
      role: newUser.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.status(201).json({
    message: "User registered successfully",
    token,
    user: {
      id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.status(200).json({
    message: "Login successful",
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  });
};

export { register, login };
