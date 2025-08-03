import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ firstName, lastName, email, password, role });
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    console.log(jwt.decode(token));

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "job-poster") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const users = await User.find().select("-password");
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT middleware
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Return comprehensive user data
    const userResponse = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      location: user.location,
      bio: user.bio,
      linkedinUrl: user.linkedinUrl,
      githubUrl: user.githubUrl,
      portfolioUrl: user.portfolioUrl,
      resume: user.resume,
      profilePicture: user.profilePicture,
      role: user.role,
    };

    // Add role-specific fields to response
    if (user.role === "job-seeker") {
      userResponse.education = user.education;
      userResponse.experience = user.experience;
      userResponse.skills = user.skills;
    }

    if (user.role === "job-poster") {
      userResponse.companyName = user.companyName;
      userResponse.companyDescription = user.companyDescription;
      userResponse.companyWebsite = user.companyWebsite;
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      user: userResponse,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT middleware
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Get all updateable fields from request body
    const {
      firstName,
      lastName,
      email,
      phone,
      location,
      education,
      experience,
      skills,
      bio,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      resume,
      profilePicture,
      // Company fields for job-poster
      companyName,
      companyDescription,
      companyWebsite,
    } = req.body;

    // Update basic profile fields (available to all users)
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (location) user.location = location;
    if (bio) user.bio = bio;
    if (linkedinUrl) user.linkedinUrl = linkedinUrl;
    if (githubUrl) user.githubUrl = githubUrl;
    if (portfolioUrl) user.portfolioUrl = portfolioUrl;
    if (resume) user.resume = resume;
    if (profilePicture) user.profilePicture = profilePicture;

    // Update job-seeker specific fields
    if (user.role === "job-seeker") {
      if (education) user.education = education;
      if (experience) user.experience = experience;
      if (skills && Array.isArray(skills)) user.skills = skills;
    }

    // Update job-poster specific fields
    if (user.role === "job-poster") {
      if (companyName) user.companyName = companyName;
      if (companyDescription) user.companyDescription = companyDescription;
      if (companyWebsite) user.companyWebsite = companyWebsite;
    }

    const updatedUser = await user.save();

    // Return comprehensive user data
    const userResponse = {
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      location: updatedUser.location,
      bio: updatedUser.bio,
      linkedinUrl: updatedUser.linkedinUrl,
      githubUrl: updatedUser.githubUrl,
      portfolioUrl: updatedUser.portfolioUrl,
      resume: updatedUser.resume,
      profilePicture: updatedUser.profilePicture,
      role: updatedUser.role,
    };

    // Add role-specific fields to response
    if (updatedUser.role === "job-seeker") {
      userResponse.education = updatedUser.education;
      userResponse.experience = updatedUser.experience;
      userResponse.skills = updatedUser.skills;
    }

    if (updatedUser.role === "job-poster") {
      userResponse.companyName = updatedUser.companyName;
      userResponse.companyDescription = updatedUser.companyDescription;
      userResponse.companyWebsite = updatedUser.companyWebsite;
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: userResponse,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const logoutUser = (req, res) => {
  res.status(200).json({ message: "Logout successful" });
};
