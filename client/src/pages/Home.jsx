import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useTheme } from "../contexts/ThemeContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";
import GradientBackground from "../components/GradientBackground";
import AnimatedButton from "../components/AnimatedButton";
import SearchAndFilter from "../components/SearchAndFilter";
import JobStats from "../components/JobStats";
import FloatingActionButton from "../components/FloatingActionButton";
import ScrollToTop from "../components/ScrollToTop";
import QuickActions from "../components/QuickActions";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const { isDark } = useTheme();
  const navigate = useNavigate();
  
  const token = localStorage.getItem("token");
  let userRole = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userRole = decoded.role;
    } catch (err) {
      console.error("Invalid token:", err.message);
    }
  }

  useEffect(() => {
    fetchJobs();
    if (userRole === "job-poster") {
      fetchMyJobs();
    }
  }, []);

  const fetchJobs = async () => {
    try {
      console.log("Token being used:", token);
      const response = await axios.get(
        "http://localhost:5000/api/jobs/all-jobs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setJobs(response.data.jobs || []);
      setFilteredJobs(response.data.jobs || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      if (error.response?.status === 401) {
        console.log("Token is invalid, redirecting to login");
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchMyJobs = async () => {
    try {
      console.log("Fetching my jobs with token:", token);
      const response = await axios.get(
        "http://localhost:5000/api/jobs/my-jobs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMyJobs(response.data.jobs || []);
    } catch (error) {
      console.error("Error fetching my jobs:", error);
      if (error.response?.status === 401) {
        console.log("Token is invalid, redirecting to login");
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    }
  };

  const handleCreateJob = () => {
    navigate('/create-job');
  };

  const handleViewProfile = () => {
    navigate('/profile');
  };

  const handleViewApplications = () => {
    navigate('/my-applications');
  };
  
  const handleManageApplications = () => {
    navigate('/application-management');
  };

  const handleViewNotifications = () => {
    navigate('/notifications');
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await axios.delete(`http://localhost:5000/api/jobs/${jobId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMyJobs(myJobs.filter(job => job._id !== jobId));
        setJobs(jobs.filter(job => job._id !== jobId));
        setFilteredJobs(filteredJobs.filter(job => job._id !== jobId));
        alert("Job deleted successfully!");
      } catch (error) {
        console.error("Error deleting job:", error);
        alert("Failed to delete job");
      }
    }
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
                Loading amazing opportunities...
              </p>
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
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className={`
              text-5xl md:text-6xl font-bold mb-6 animate-float
              bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent
              ${isDark ? 'from-purple-400 via-blue-400 to-purple-600' : ''}
            `}>
              Welcome to DevLancer ✨
            </h1>
            <p className={`text-xl md:text-2xl max-w-3xl mx-auto mb-8 font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {userRole === "job-poster"
                ? "Post job opportunities and find the best talent for your company 🎯"
                : "Discover amazing job opportunities that match your skills and interests 🚀"}
            </p>
            {userRole === "job-poster" && (
              <Link to="/create-job">
                <AnimatedButton className="text-lg px-8 py-4">
                  Post a New Job 💼
                </AnimatedButton>
              </Link>
            )}
          </div>

          {/* Job Statistics */}
          <JobStats jobs={jobs} myJobs={myJobs} userRole={userRole} />

          {/* Quick Actions */}
          <QuickActions 
            userRole={userRole}
            onViewProfile={handleViewProfile}
            onCreateJob={handleCreateJob}
            onViewApplications={handleViewApplications}
            onManageApplications={handleManageApplications}
            onViewNotifications={handleViewNotifications}
          />

        {/* Tabs for Job Poster */}
        {userRole === "job-poster" && (
          <div className="flex justify-center mb-8">
            <div className={`
              ${isDark ? 'bg-gray-800/50 backdrop-blur-md' : 'bg-white/70 backdrop-blur-md'} 
              rounded-2xl p-2 shadow-xl border 
              ${isDark ? 'border-gray-700' : 'border-white/20'}
            `}>
              <button
                onClick={() => setActiveTab("all")}
                className={`px-8 py-3 rounded-xl transition-all duration-300 font-medium ${
                  activeTab === "all"
                    ? `bg-gradient-to-r ${isDark ? 'from-purple-500 to-blue-500' : 'from-indigo-600 to-purple-600'} text-white shadow-lg transform scale-105`
                    : `${isDark ? 'text-purple-300 hover:bg-purple-500/20' : 'text-indigo-600 hover:bg-indigo-50'}`
                }`}
              >
                All Jobs ({jobs.length})
              </button>
              <button
                onClick={() => setActiveTab("my")}
                className={`px-8 py-3 rounded-xl transition-all duration-300 font-medium ${
                  activeTab === "my"
                    ? `bg-gradient-to-r ${isDark ? 'from-purple-500 to-blue-500' : 'from-indigo-600 to-purple-600'} text-white shadow-lg transform scale-105`
                    : `${isDark ? 'text-purple-300 hover:bg-purple-500/20' : 'text-indigo-600 hover:bg-indigo-50'}`
                }`}
              >
                My Jobs ({myJobs.length})
              </button>
            </div>
          </div>
        )}

        {/* Search and Filter Component */}
        {activeTab === "all" && (
          <SearchAndFilter 
            jobs={jobs} 
            onFilteredJobs={setFilteredJobs}
          />
        )}

        {/* Jobs Grid */}
        <div className="max-w-6xl mx-auto" id="jobs-section">
          {activeTab === "all" && (
            <div>
              <h2 className={`
                text-3xl md:text-4xl font-bold mb-8 text-center
                bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent
                ${isDark ? 'from-purple-400 via-blue-400 to-purple-600' : ''}
              `}>
                {userRole === "job-poster" ? "All Available Jobs 📋" : "Job Opportunities 🎯"}
              </h2>
              {jobs.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-8xl mb-6 animate-float">�</div>
                  <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    No jobs available
                  </h3>
                  <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {userRole === "job-poster"
                      ? "Be the first to post a job! 🚀"
                      : "Check back later for new opportunities 🕐"}
                  </p>
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-8xl mb-6 animate-float">🔍</div>
                  <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    No jobs match your filters
                  </h3>
                  <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Try adjusting your search criteria ✨
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredJobs.map((job) => (
                    <JobCard key={job._id} job={job} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "my" && userRole === "job-poster" && (
            <div>
              <h2 className={`
                text-3xl md:text-4xl font-bold mb-8 text-center
                bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent
                ${isDark ? 'from-purple-400 via-blue-400 to-purple-600' : ''}
              `}>
                My Posted Jobs 💼
              </h2>
              {myJobs.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-8xl mb-6 animate-float">📝</div>
                  <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    You haven't posted any jobs yet
                  </h3>
                  <p className={`text-lg mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Start by creating your first job posting! 🚀
                  </p>
                  <Link to="/create-job">
                    <AnimatedButton className="text-lg px-8 py-4">
                      Create Job 💼
                    </AnimatedButton>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myJobs.map((job) => (
                    <div key={job._id} className="relative">
                      <JobCard job={job} />
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button
                          onClick={() => handleDeleteJob(job._id)}
                          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition text-sm"
                          title="Delete Job"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Floating Action Button */}
      <FloatingActionButton 
        userRole={userRole}
        onCreateJob={handleCreateJob}
      />

      {/* Scroll to Top Button */}
      <ScrollToTop />
      </div>
    </GradientBackground>
  );
}
