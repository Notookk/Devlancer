import express from "express";
import {
  getAllUsers,
  getUserById,
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
  updateUserProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.get("/all-users", protect, getAllUsers);
router.get("/all-users/:id", protect, getUserById);
router.put("/update-profile", protect, updateUserProfile);
router.post("/logout", protect, logoutUser);

export default router;
