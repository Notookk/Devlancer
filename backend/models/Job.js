import mongoose from "mongoose";
import bcrypt from "bcrypt";

const jobSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    location: String,
    description: String,
    skillsRequired: {
      type: [String],
      required: true,
    },
    salaryRange: String,
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Remote"],
      required: true,
    },
    poster: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
// module.exports = mongoose.model("Job", jobSchema);

const Job = mongoose.model("Job", jobSchema);
export default Job;
