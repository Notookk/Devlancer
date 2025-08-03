import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
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
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/jobs/all-jobs/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setJob(response.data.job);
      
      // Check if user has already applied (you'll need to implement this in backend)
      // For now, we'll assume user hasn't applied
      setHasApplied(false);
    } catch (error) {
      console.error("Error fetching job details:", error);
      if (error.response?.status === 404) {
        navigate("/home");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!token) {
      navigate("/");
      return;
    }

    setApplying(true);
    try {
      await axios.post(
        "http://localhost:5000/api/applications",
        {
          jobId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setHasApplied(true);
      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Error applying for job:", error);
      alert("Failed to submit application. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await axios.delete(`http://localhost:5000/api/jobs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert("Job deleted successfully!");
        navigate("/home");
      } catch (error) {
        console.error("Error deleting job:", error);
        alert("Failed to delete job");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading job details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Not Found</h2>
            <Link
              to="/home"
              className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition"
            >
              Back to Jobs
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isJobOwner = job.poster._id === userId;
  const canApply = userRole === "job-seeker" && !isJobOwner && !hasApplied;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-green-50 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            to="/home"
            className="inline-flex items-center text-green-600 hover:text-green-700 mb-6"
          >
            ← Back to Jobs
          </Link>

          {/* Job Header */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {job.jobTitle}
                </h1>
                <p className="text-xl text-gray-600 mb-2">{job.company}</p>
                {job.location && (
                  <p className="text-gray-600 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {job.location}
                  </p>
                )}
              </div>
              <div className="text-right">
                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                  {job.jobType}
                </span>
                {job.salaryRange && (
                  <p className="text-green-600 font-bold text-xl mt-2">
                    {job.salaryRange}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              {canApply && (
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {applying ? "Applying..." : "Apply Now"}
                </button>
              )}
              
              {hasApplied && (
                <div className="bg-gray-100 text-gray-600 px-8 py-3 rounded-xl font-medium">
                  Already Applied ✓
                </div>
              )}

              {isJobOwner && (
                <div className="flex gap-3">
                  <Link
                    to={`/edit-job/${job._id}`}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition font-medium"
                  >
                    Edit Job
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition font-medium"
                  >
                    Delete Job
                  </button>
                </div>
              )}

              {userRole === "job-poster" && !isJobOwner && (
                <div className="bg-gray-100 text-gray-600 px-8 py-3 rounded-xl font-medium">
                  Job Posted by Another User
                </div>
              )}
            </div>
          </div>

          {/* Job Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              {job.description && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Job Description
                  </h2>
                  <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {job.description}
                  </div>
                </div>
              )}

              {/* Skills Required */}
              {job.skillsRequired && job.skillsRequired.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Skills Required
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {job.skillsRequired.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Job Info */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Job Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-600 text-sm">Posted by:</span>
                    <p className="font-medium">
                      {job.poster.firstName} {job.poster.lastName}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Posted on:</span>
                    <p className="font-medium">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Job Type:</span>
                    <p className="font-medium">{job.jobType}</p>
                  </div>
                  {job.location && (
                    <div>
                      <span className="text-gray-600 text-sm">Location:</span>
                      <p className="font-medium">{job.location}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Company Info */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  About {job.company}
                </h3>
                <p className="text-gray-700">
                  Learn more about this opportunity at {job.company}. 
                  Contact the job poster for additional information about 
                  the company culture and benefits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
