import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/User.js";
import Message from "../models/Message.js";
import { createNotification } from "./notificationController.js";

export const applyToJob = async (req, res) => {
  const user = req.user;

  if (user.role !== "job-seeker") {
    return res
      .status(403)
      .json({ message: "Only job seekers can apply to jobs" });
  }

  try {
    const { jobId } = req.body;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Check if user already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: user._id,
    });

    if (existingApplication) {
      return res.status(400).json({ message: "You already applied to this job" });
    }

    const application = new Application({
      job: job._id,
      applicant: user._id,
    });

    await application.save();
    res.status(201).json({ message: "Applied successfully", application });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to apply", error: error.message });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.user._id,
    }).populate({
      path: "job",
      populate: {
        path: "poster",
        select: "firstName lastName email"
      }
    }).sort({ createdAt: -1 });
    
    res.status(200).json({ applications });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch applications", error: error.message });
  }
};

export const withdrawApplication = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if the application belongs to the current user
    if (application.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to withdraw this application" });
    }

    await Application.findByIdAndDelete(applicationId);
    res.status(200).json({ message: "Application withdrawn successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to withdraw application", error: error.message });
  }
};

// Get applications for job poster's jobs
export const getJobApplications = async (req, res) => {
  try {
    const user = req.user;
    
    if (user.role !== "job-poster") {
      return res.status(403).json({ message: "Only job posters can view applications" });
    }

    const { jobId } = req.params;
    
    // Verify the job belongs to the current user
    const job = await Job.findOne({ _id: jobId, poster: user._id });
    if (!job) {
      return res.status(404).json({ message: "Job not found or unauthorized" });
    }

    const applications = await Application.find({ job: jobId })
      .populate({
        path: "applicant",
        select: "firstName lastName email phone location skills education experience resume linkedinUrl githubUrl portfolioUrl bio"
      })
      .populate("job", "jobTitle company")
      .sort({ createdAt: -1 });

    res.status(200).json({ 
      message: "Applications fetched successfully", 
      applications,
      jobTitle: job.jobTitle 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to fetch applications", 
      error: error.message 
    });
  }
};

// Get all applications for job poster's jobs
export const getAllMyJobApplications = async (req, res) => {
  try {
    const user = req.user;
    
    if (user.role !== "job-poster") {
      return res.status(403).json({ message: "Only job posters can view applications" });
    }

    // Get all jobs posted by this user
    const myJobs = await Job.find({ poster: user._id }).select('_id');
    const jobIds = myJobs.map(job => job._id);

    const applications = await Application.find({ job: { $in: jobIds } })
      .populate({
        path: "applicant",
        select: "firstName lastName email phone location skills education experience resume linkedinUrl githubUrl portfolioUrl bio"
      })
      .populate("job", "title company location")
      .sort({ createdAt: -1 });

    res.status(200).json({ 
      message: "All applications fetched successfully", 
      applications 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to fetch applications", 
      error: error.message 
    });
  }
};

// Update application status (approve/reject)
export const updateApplicationStatus = async (req, res) => {
  try {
    const user = req.user;
    const { applicationId } = req.params;
    const { status, notes } = req.body;

    if (user.role !== "job-poster") {
      return res.status(403).json({ message: "Only job posters can update application status" });
    }

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Must be 'accepted' or 'rejected'" });
    }

    const application = await Application.findById(applicationId).populate("job");
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Verify the job belongs to the current user
    if (application.job.poster.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to update this application" });
    }

    application.status = status;
    application.reviewedAt = new Date();
    application.reviewedBy = user._id;
    if (notes) application.notes = notes;

    await application.save();

    // Populate the updated application for response
    await application.populate({
      path: "applicant",
      select: "firstName lastName email"
    });

    // Create notification for the applicant
    try {
      const statusText = status === 'accepted' ? 'approved' : 'rejected';
      const title = `Application ${statusText.charAt(0).toUpperCase() + statusText.slice(1)}`;
      const message = `Your application for "${application.job.jobTitle}" has been ${statusText}${notes ? '. ' + notes : '.'}`;
      
      await createNotification(
        application.applicant._id,
        'application_status',
        title,
        message,
        application._id,
        'Application',
        {
          jobTitle: application.job.jobTitle,
          companyName: application.job.company,
          applicationStatus: status,
          approvalMessage: notes || null
        }
      );
    } catch (notificationError) {
      console.error("Error creating notification:", notificationError);
      // Don't fail the whole operation if notification fails
    }

    res.status(200).json({ 
      message: `Application ${status} successfully`, 
      application 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to update application status", 
      error: error.message 
    });
  }
};

// Send message to applicant
export const sendMessage = async (req, res) => {
  try {
    const user = req.user;
    const { applicationId } = req.params;
    const { content } = req.body;

    if (user.role !== "job-poster") {
      return res.status(403).json({ message: "Only job posters can send messages" });
    }

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: "Message content is required" });
    }

    const application = await Application.findById(applicationId)
      .populate("job")
      .populate("applicant", "firstName lastName");
    
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Ensure job data is loaded
    if (!application.job) {
      return res.status(404).json({ message: "Job data not found" });
    }

    // Verify the job belongs to the current user
    if (application.job.poster.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to message this applicant" });
    }

    const message = new Message({
      application: applicationId,
      sender: user._id,
      recipient: application.applicant,
      content: content.trim(),
    });

    await message.save();
    await message.populate([
      { path: "sender", select: "firstName lastName" },
      { path: "recipient", select: "firstName lastName" }
    ]);

    // Create notification for the applicant about the new message
    try {
      const title = "New Message Received";
      const jobTitle = application.job?.jobTitle || "Unknown Job";
      const companyName = application.job?.company || "Unknown Company";
      
      // Ensure user data is available
      const senderFirstName = user.firstName || 'Unknown';
      const senderLastName = user.lastName || 'User';
      const senderName = `${senderFirstName} ${senderLastName}`;
      
      console.log('Sending message notification:', {
        jobTitle,
        companyName,
        senderName,
        userId: user._id,
        userRole: user.role
      });
      
      const notificationMessage = `You received a message from ${senderName} regarding your application for "${jobTitle}"`;
      
      await createNotification(
        application.applicant,
        'message_received',
        title,
        notificationMessage,
        message._id,
        'Message',
        {
          jobTitle: jobTitle,
          companyName: companyName,
          senderName: senderName
        }
      );
    } catch (notificationError) {
      console.error("Error creating message notification:", notificationError);
      // Don't fail the whole operation if notification fails
    }

    res.status(201).json({ 
      message: "Message sent successfully", 
      messageData: message 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to send message", 
      error: error.message 
    });
  }
};

// Get messages for an application
export const getApplicationMessages = async (req, res) => {
  try {
    const user = req.user;
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId).populate("job");
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if user is either the job poster or the applicant
    const isJobPoster = user.role === "job-poster" && application.job.poster.toString() === user._id.toString();
    const isApplicant = user.role === "job-seeker" && application.applicant.toString() === user._id.toString();

    if (!isJobPoster && !isApplicant) {
      return res.status(403).json({ message: "Unauthorized to view these messages" });
    }

    const messages = await Message.find({ application: applicationId })
      .populate("sender", "firstName lastName role")
      .populate("recipient", "firstName lastName role")
      .sort({ createdAt: 1 });

    // Mark messages as read if user is the recipient
    if (messages.length > 0) {
      await Message.updateMany(
        { 
          application: applicationId, 
          recipient: user._id, 
          isRead: false 
        },
        { 
          isRead: true, 
          readAt: new Date() 
        }
      );
    }

    res.status(200).json({ 
      message: "Messages fetched successfully", 
      messages 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to fetch messages", 
      error: error.message 
    });
  }
};

// Get a single message by ID (for notifications)
export const getMessageById = async (req, res) => {
  try {
    const user = req.user;
    const { messageId } = req.params;

    const message = await Message.findById(messageId)
      .populate("sender", "firstName lastName role")
      .populate("recipient", "firstName lastName role")
      .populate({
        path: "application",
        populate: {
          path: "job",
          select: "title company"
        }
      });

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Check if user is either the sender or recipient
    if (message.sender._id.toString() !== user._id.toString() && 
        message.recipient._id.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to view this message" });
    }

    // Mark as read if user is the recipient and it's unread
    if (message.recipient._id.toString() === user._id.toString() && !message.isRead) {
      message.isRead = true;
      message.readAt = new Date();
      await message.save();
    }

    res.status(200).json({ 
      message: "Message fetched successfully", 
      messageData: message 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to fetch message", 
      error: error.message 
    });
  }
};
