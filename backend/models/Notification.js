import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["application_status", "message_received", "job_posted", "application_received"],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    // Can reference Application, Job, or Message
  },
  relatedModel: {
    type: String,
    enum: ["Application", "Job", "Message"],
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  readAt: {
    type: Date,
  },
  data: {
    // Additional data like job title, company name, etc.
    jobTitle: String,
    companyName: String,
    applicationStatus: String,
    senderName: String,
  },
}, {
  timestamps: true,
});

// Index for efficient queries
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });

export default mongoose.model("Notification", notificationSchema);
