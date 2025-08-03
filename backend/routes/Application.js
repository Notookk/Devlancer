import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { 
  applyToJob, 
  getMyApplications, 
  withdrawApplication,
  getJobApplications,
  getAllMyJobApplications,
  updateApplicationStatus,
  sendMessage,
  getApplicationMessages,
  getMessageById
} from "../controllers/applicationController.js";

const router = express.Router();

// Apply to a job
router.post("/apply", protect, applyToJob);

// Get my applications (for job seekers)
router.get("/my-applications", protect, getMyApplications);

// Get applications for a specific job (for job posters)
router.get("/job/:jobId", protect, getJobApplications);

// Get all applications for job poster's jobs
router.get("/my-job-applications", protect, getAllMyJobApplications);

// Update application status (approve/reject)
router.put("/:applicationId/status", protect, updateApplicationStatus);

// Send message to applicant
router.post("/:applicationId/message", protect, sendMessage);

// Get messages for an application
router.get("/:applicationId/messages", protect, getApplicationMessages);

// Get a single message by ID (for notifications)
router.get("/message/:messageId", protect, getMessageById);

// Withdraw application
router.delete("/:id", protect, withdrawApplication);

export default router;