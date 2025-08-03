import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createJob, deleteJob, getAllJobs, getJobById, getJobsByPoster, updateJob } from "../controllers/jobController.js";

const router = express.Router();

router.post("/", protect, createJob);
router.get("/all-jobs", protect, getAllJobs);
router.get("/all-jobs/:id", protect, getJobById);
router.get("/my-jobs", protect, getJobsByPoster);
router.put("/update-job/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);

export default router;
