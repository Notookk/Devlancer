import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useTheme } from "../contexts/ThemeContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import GradientBackground from "../components/GradientBackground";
import AnimatedButton from "../components/AnimatedButton";

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const token = localStorage.getItem("token");
  let userRole = null;
  let userId = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userRole = decoded.role;
      userId = decoded.id;
    } catch (err) {
      console.error("Invalid token:", err.message);
    }
  }

  useEffect(() => {
    fetchJobDetails();
    if (userRole === "job-seeker") {
      checkApplicationStatus();
    }
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      console.log("Fetching job details with token:", token);
      const response = await axios.get(
        `http://localhost:5000/api/jobs/all-jobs/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setJob(response.data);
    } catch (error) {
      console.error("Error fetching job details:", error);
      if (error.response?.status === 401) {
        console.log("Token is invalid, redirecting to login");
        localStorage.removeItem("token");
        window.location.href = "/";
      } else {
        navigate("/home");
      }
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    try {
      console.log("Checking application status with token:", token);
      const response = await axios.get(
        `http://localhost:5000/api/applications/my-applications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const applications = response.data.applications || [];
      const appliedToThis = applications.some(app => app.job._id === id);
      setHasApplied(appliedToThis);
    } catch (error) {
      console.error("Error checking application status:", error);
      if (error.response?.status === 401) {
        console.log("Token is invalid, redirecting to login");
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    }
  };

  const handleApply = async () => {
    if (!token || userRole !== "job-seeker") {
      alert("Please login as a job seeker to apply");
      return;
    }

    setApplying(true);
    try {
      console.log("Applying for job with token:", token);
      await axios.post(
        "http://localhost:5000/api/applications/apply",
        { jobId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setHasApplied(true);
      alert("Application submitted successfully! 🎉");
    } catch (error) {
      console.error("Error applying for job:", error);
      if (error.response?.status === 401) {
        console.log("Token is invalid, redirecting to login");
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/";
      } else {
        alert(error.response?.data?.message || "Failed to apply for job");
      }
    } finally {
      setApplying(false);
    }
  };

  const getJobTypeColor = (type) => {
    const colors = {
      "Full-time": isDark ? "bg-green-500/20 text-green-300 border-green-500/30" : "bg-green-100 text-green-700 border-green-300",
      "Part-time": isDark ? "bg-blue-500/20 text-blue-300 border-blue-500/30" : "bg-blue-100 text-blue-700 border-blue-300",
      "Contract": isDark ? "bg-orange-500/20 text-orange-300 border-orange-500/30" : "bg-orange-100 text-orange-700 border-orange-300",
      "Remote": isDark ? "bg-purple-500/20 text-purple-300 border-purple-500/30" : "bg-purple-100 text-purple-700 border-purple-300",
    };
    return colors[type] || (isDark ? "bg-gray-500/20 text-gray-300 border-gray-500/30" : "bg-gray-100 text-gray-700 border-gray-300");
  };

  if (loading) {
    return (
      <GradientBackground variant="default">
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <div className={`
                w-16 h-16 mx-auto mb-4 rounded-full border-4 
                ${isDark ? 'border-purple-500 border-t-transparent' : 'border-indigo-500 border-t-transparent'}
                animate-spin
              `}></div>
              <p className={`mt-4 text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Loading job details...
              </p>
            </div>
          </main>
          <Footer />
        </div>
      </GradientBackground>
    );
  }

  if (!job) {
    return (
      <GradientBackground variant="default">
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl mb-6">❌</div>
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Job not found
              </h2>
              <AnimatedButton onClick={() => navigate("/home")}>
                Back to Home
              </AnimatedButton>
            </div>
          </main>
          <Footer />
        </div>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground variant="default">
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className={`
              ${isDark ? 'bg-gray-800/70 backdrop-blur-md border-gray-700' : 'bg-white/80 backdrop-blur-md border-white/20'} 
              p-8 rounded-3xl shadow-2xl mb-8 border
            `}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex-1">
                  <h1 className={`
                    text-3xl md:text-4xl font-bold mb-4
                    bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent
                    ${isDark ? 'from-purple-400 via-blue-400 to-purple-600' : ''}
                  `}>
                    {job.jobTitle}
                  </h1>
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🏢</span>
                      <span className={`text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {job.company}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">📍</span>
                      <span className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {job.location || "Remote"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <span className={`
                      px-4 py-2 rounded-2xl border font-medium
                      ${getJobTypeColor(job.jobType)}
                    `}>
                      {job.jobType}
                    </span>
                    {job.salaryRange && (
                      <span className={`
                        px-4 py-2 rounded-2xl font-medium
                        bg-gradient-to-r ${isDark ? 'from-purple-500/20 to-blue-500/20 text-purple-300 border border-purple-500/30' : 'from-indigo-500/10 to-purple-500/10 text-indigo-700 border border-indigo-300'}
                      `}>
                        💰 {job.salaryRange}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Apply Button */}
                {userRole === "job-seeker" && (
                  <div className="flex flex-col gap-3">
                    {hasApplied ? (
                      <div className={`
                        px-6 py-3 rounded-2xl text-center font-medium
                        ${isDark ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-green-100 text-green-700 border border-green-300'}
                      `}>
                        ✅ Applied
                      </div>
                    ) : (
                      <AnimatedButton
                        onClick={handleApply}
                        disabled={applying}
                        className="text-lg px-8 py-4"
                      >
                        {applying ? "Applying... ⏳" : "Apply Now 🚀"}
                      </AnimatedButton>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Job Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className={`
                  ${isDark ? 'bg-gray-800/70 backdrop-blur-md border-gray-700' : 'bg-white/80 backdrop-blur-md border-white/20'} 
                  p-8 rounded-3xl shadow-2xl border
                `}>
                  <h2 className={`
                    text-2xl font-bold mb-6
                    bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent
                    ${isDark ? 'from-purple-400 via-blue-400 to-purple-600' : ''}
                  `}>
                    Job Description 📋
                  </h2>
                  <div className={`
                    text-lg leading-relaxed whitespace-pre-wrap
                    ${isDark ? 'text-gray-300' : 'text-gray-700'}
                  `}>
                    {job.jobDescription || job.description || "No description provided."}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Skills Required */}
                {job.skillsRequired && job.skillsRequired.length > 0 && (
                  <div className={`
                    ${isDark ? 'bg-gray-800/70 backdrop-blur-md border-gray-700' : 'bg-white/80 backdrop-blur-md border-white/20'} 
                    p-6 rounded-3xl shadow-2xl border
                  `}>
                    <h3 className={`
                      text-xl font-bold mb-4
                      bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent
                      ${isDark ? 'from-purple-400 via-blue-400 to-purple-600' : ''}
                    `}>
                      Skills Required 🎯
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {job.skillsRequired.map((skill, index) => (
                        <span
                          key={index}
                          className={`
                            px-3 py-2 rounded-xl text-sm font-medium
                            ${isDark ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-indigo-100 text-indigo-700 border border-indigo-300'}
                          `}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Job Info */}
                <div className={`
                  ${isDark ? 'bg-gray-800/70 backdrop-blur-md border-gray-700' : 'bg-white/80 backdrop-blur-md border-white/20'} 
                  p-6 rounded-3xl shadow-2xl border
                `}>
                  <h3 className={`
                    text-xl font-bold mb-4
                    bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent
                    ${isDark ? 'from-purple-400 via-blue-400 to-purple-600' : ''}
                  `}>
                    Job Information ℹ️
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Posted:</span>
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                        {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Type:</span>
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{job.jobType}</span>
                    </div>
                    {job.salaryRange && (
                      <div className="flex justify-between">
                        <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Salary:</span>
                        <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{job.salaryRange}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <div className="mt-8 text-center">
              <AnimatedButton onClick={() => navigate("/home")}>
                ← Back to Jobs
              </AnimatedButton>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </GradientBackground>
  );
}
