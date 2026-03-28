import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { connection } from "../config/dbconfig.js";
const JWT_SECRET = process.env.JWT_SECRET || "secret-code";

// register based on the role
export const register = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const db = await connection();
    const users = db.collection("users");

    const existing = await users.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await users.insertOne({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    const token = jwt.sign(
      { id: result.insertedId, role: role || "user" },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      success: true,
      token,
      role: role || "user"
    });

  } catch (error) {
    console.error("Register Error FULL:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// login according to role
export const login = async (req, res) => {
  try {
    console.log("LOGIN BODY:", req.body);

    const { email, password } = req.body;

    const db = await connection();
    const users = db.collection("users");

    const user = await users.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      role: user.role,
    });

  } catch (error) {
    console.error("Login Error FULL:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


