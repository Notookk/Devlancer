import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["job-seeker", "job-poster"],
    required: true,
  },
  phone: String,
  location: String,
  skills: [String],
  education: String,
  experience: String,
  // Enhanced profile fields
  profilePicture: String,
  resume: String, // File path or URL
  linkedinUrl: String,
  githubUrl: String,
  portfolioUrl: String,
  bio: {
    type: String,
    maxlength: 500,
  },
  // Company fields for job-poster
  companyName: String,
  companyDescription: String,
  companyWebsite: String,
  companyLogo: String,
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// module.exports = mongoose.model("User", userSchema);

const User = mongoose.model("User", userSchema);
export default User;
