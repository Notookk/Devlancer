import express from "express";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUnreadCount,
} from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get notifications for the authenticated user
router.get("/", protect, getUserNotifications);

// Get unread notification count
router.get("/unread-count", protect, getUnreadCount);

// Mark a specific notification as read
router.put("/:notificationId/read", protect, markNotificationAsRead);

// Mark all notifications as read
router.put("/mark-all-read", protect, markAllNotificationsAsRead);

// Delete a notification
router.delete("/:notificationId", protect, deleteNotification);

export default router;
