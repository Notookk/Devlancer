import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import GradientBackground from "../components/GradientBackground";
import AnimatedButton from "../components/AnimatedButton";

export default function MyApplications() {
  const { isDark } = useTheme();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const fetchMyApplications = async () => {
    try {
      console.log("Fetching applications with token:", token);
      const response = await axios.get(
        "http://localhost:5000/api/applications/my-applications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setApplications(response.data.applications || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      if (error.response?.status === 401) {
        console.log("Token is invalid, redirecting to login");
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawApplication = async (applicationId) => {
    if (window.confirm("Are you sure you want to withdraw this application?")) {
      try {
        await axios.delete(
          `http://localhost:5000/api/applications/${applicationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setApplications(applications.filter(app => app._id !== applicationId));
        alert("Application withdrawn successfully!");
      } catch (error) {
        console.error("Error withdrawing application:", error);
        alert("Failed to withdraw application");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "accepted":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading applications...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-green-50 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">My Applications</h1>

          {applications.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No applications yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start applying to jobs to see your applications here.
              </p>
              <Link
                to="/home"
                className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition"
              >
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {applications.map((application) => (
                <div
                  key={application._id}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {application.job.jobTitle}
                      </h3>
                      <p className="text-gray-600 font-medium mb-1">
                        {application.job.company}
                      </p>
                      {application.job.location && (
                        <p className="text-gray-500 text-sm">
                          📍 {application.job.location}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(
                          application.status
                        )}`}
                      >
                        {application.status}
                      </span>
                      <p className="text-gray-500 text-sm mt-2">
                        Applied: {new Date(application.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {application.job.description && (
                    <p className="text-gray-700 mb-4 line-clamp-2">
                      {application.job.description.length > 200
                        ? `${application.job.description.substring(0, 200)}...`
                        : application.job.description}
                    </p>
                  )}

                  {application.job.skillsRequired && application.job.skillsRequired.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {application.job.skillsRequired.slice(0, 5).map((skill, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                        {application.job.skillsRequired.length > 5 && (
                          <span className="text-gray-500 text-xs">
                            +{application.job.skillsRequired.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div className="flex gap-3">
                      <Link
                        to={`/job/${application.job._id}`}
                        className="text-green-600 hover:text-green-700 font-medium"
                      >
                        View Job Details
                      </Link>
                    </div>
                    <div className="flex gap-3">
                      {application.job.salaryRange && (
                        <span className="text-green-600 font-semibold">
                          {application.job.salaryRange}
                        </span>
                      )}
                      {application.status === "pending" && (
                        <button
                          onClick={() => handleWithdrawApplication(application._id)}
                          className="text-red-600 hover:text-red-700 font-medium"
                        >
                          Withdraw
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
