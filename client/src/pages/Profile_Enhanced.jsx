import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import GradientBackground from "../components/GradientBackground";
import AnimatedButton from "../components/AnimatedButton";
import { useTheme } from "../contexts/ThemeContext";

function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('view');
  const { isDark } = useTheme();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    try {
      if (!token || !userId) {
        alert("Please log in first");
        navigate("/");
        return;
      }

      const fetchProfile = async () => {
        try {
          console.log("Fetching profile for user:", userId);
          const res = await axios.get(
            "http://localhost:5000/api/auth/profile",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const userData = res.data.user;
          console.log("👤 Profile Data:", userData);
          setProfileData(userData);

          // Reset the form with existing profile values
          reset({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
            phone: userData.phone || "",
            location: userData.location || "",
            education: userData.education || "",
            experience: userData.experience || "",
            skills: userData.skills ? userData.skills.join(", ") : "",
            bio: userData.bio || "",
            linkedinUrl: userData.linkedinUrl || "",
            githubUrl: userData.githubUrl || "",
            portfolioUrl: userData.portfolioUrl || "",
            // Company fields for job-poster
            companyName: userData.companyName || "",
            companyDescription: userData.companyDescription || "",
            companyWebsite: userData.companyWebsite || "",
          });
        } catch (error) {
          console.error("Error fetching profile:", error);
          if (error.response?.status === 401) {
            console.log("Token is invalid, redirecting to login");
            localStorage.removeItem("token");
            window.location.href = "/";
          }
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    } catch (err) {
      console.error("Error fetching profile data:", err.message);
      setLoading(false);
    }
  }, [reset, token, userId]);

  const onSubmit = async (data) => {
    try {
      console.log("Updating profile with token:", token);
      const res = await axios.put(
        "http://localhost:5000/api/auth/update-profile",
        {
          ...data,
          skills: data.skills.split(",").map((s) => s.trim()), // convert to array
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Profile Updated:", res.data);
      alert("Profile updated successfully!");
      setActiveTab('view');
      
      // Refresh profile data
      const updatedProfile = await axios.get(
        "http://localhost:5000/api/auth/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProfileData(updatedProfile.data.user);
    } catch (err) {
      console.error("❌ Error:", err);
      if (err.response?.status === 401) {
        console.log("Token is invalid, redirecting to login");
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/";
      } else {
        alert("Profile update failed.");
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
                Loading profile...
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
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className={`
              text-4xl md:text-5xl font-bold mb-6 animate-float
              bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent
              ${isDark ? 'from-purple-400 via-blue-400 to-purple-600' : ''}
            `}>
              {activeTab === 'edit' ? 'Update Profile ✨' : 'My Profile 👤'}
            </h1>
            
            {/* Tabs */}
            <div className="flex justify-center mb-8">
              <div className={`
                ${isDark ? 'bg-gray-800/50 backdrop-blur-md' : 'bg-white/70 backdrop-blur-md'} 
                rounded-2xl p-2 shadow-xl border 
                ${isDark ? 'border-gray-700' : 'border-white/20'}
              `}>
                <button
                  onClick={() => setActiveTab('view')}
                  className={`px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
                    activeTab === 'view'
                      ? `bg-gradient-to-r ${isDark ? 'from-purple-500 to-blue-500' : 'from-indigo-600 to-purple-600'} text-white shadow-lg transform scale-105`
                      : `${isDark ? 'text-purple-300 hover:bg-purple-500/20' : 'text-indigo-600 hover:bg-indigo-50'}`
                  }`}
                >
                  👁️ View Profile
                </button>
                <button
                  onClick={() => setActiveTab('edit')}
                  className={`px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
                    activeTab === 'edit'
                      ? `bg-gradient-to-r ${isDark ? 'from-purple-500 to-blue-500' : 'from-indigo-600 to-purple-600'} text-white shadow-lg transform scale-105`
                      : `${isDark ? 'text-purple-300 hover:bg-purple-500/20' : 'text-indigo-600 hover:bg-indigo-50'}`
                  }`}
                >
                  ✏️ Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Profile View */}
          {activeTab === 'view' && profileData && (
            <div className="max-w-4xl mx-auto">
              <div className={`
                ${isDark ? 'bg-gray-800/70 backdrop-blur-md border-gray-700' : 'bg-white/80 backdrop-blur-md border-white/20'} 
                p-8 rounded-3xl shadow-2xl border
              `}>
                {/* Header Section */}
                <div className="text-center mb-8">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                    <span className="text-3xl text-white font-bold">
                      {profileData.firstName?.[0]}{profileData.lastName?.[0]}
                    </span>
                  </div>
                  <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {profileData.firstName} {profileData.lastName}
                  </h2>
                  <p className={`text-lg ${isDark ? 'text-purple-300' : 'text-indigo-600'} capitalize`}>
                    {userRole?.replace('-', ' ')}
                  </p>
                  {profileData.bio && (
                    <p className={`mt-4 text-center max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {profileData.bio}
                    </p>
                  )}
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <span className="w-6 text-lg">📧</span>
                        <span className={`ml-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {profileData.email}
                        </span>
                      </div>
                      {profileData.phone && (
                        <div className="flex items-center">
                          <span className="w-6 text-lg">📞</span>
                          <span className={`ml-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            {profileData.phone}
                          </span>
                        </div>
                      )}
                      {profileData.location && (
                        <div className="flex items-center">
                          <span className="w-6 text-lg">📍</span>
                          <span className={`ml-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            {profileData.location}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Links */}
                  <div>
                    <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Links
                    </h3>
                    <div className="space-y-3">
                      {profileData.linkedinUrl && (
                        <div className="flex items-center">
                          <span className="w-6 text-lg">💼</span>
                          <a 
                            href={profileData.linkedinUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`ml-3 ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} font-medium`}
                          >
                            LinkedIn Profile
                          </a>
                        </div>
                      )}
                      {profileData.githubUrl && (
                        <div className="flex items-center">
                          <span className="w-6 text-lg">🔗</span>
                          <a 
                            href={profileData.githubUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`ml-3 ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} font-medium`}
                          >
                            GitHub Profile
                          </a>
                        </div>
                      )}
                      {profileData.portfolioUrl && (
                        <div className="flex items-center">
                          <span className="w-6 text-lg">🌐</span>
                          <a 
                            href={profileData.portfolioUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`ml-3 ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} font-medium`}
                          >
                            Portfolio Website
                          </a>
                        </div>
                      )}
                      {profileData.resume && (
                        <div className="flex items-center">
                          <span className="w-6 text-lg">📄</span>
                          <a 
                            href={profileData.resume} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`ml-3 ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} font-medium`}
                          >
                            Download Resume
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                {userRole === 'job-seeker' && (
                  <div className="mb-8">
                    <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Professional Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {profileData.education && (
                        <div>
                          <h4 className={`font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            🎓 Education
                          </h4>
                          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {profileData.education}
                          </p>
                        </div>
                      )}
                      {profileData.experience && (
                        <div>
                          <h4 className={`font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            💼 Experience
                          </h4>
                          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {profileData.experience}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Skills */}
                    {profileData.skills && profileData.skills.length > 0 && (
                      <div className="mt-6">
                        <h4 className={`font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          🛠️ Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {profileData.skills.map((skill, index) => (
                            <span
                              key={index}
                              className={`
                                px-3 py-1 rounded-lg text-sm font-medium
                                ${isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-indigo-100 text-indigo-700'}
                              `}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Company Information for Job Posters */}
                {userRole === 'job-poster' && (
                  <div className="mb-8">
                    <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Company Information
                    </h3>
                    <div className="space-y-4">
                      {profileData.companyName && (
                        <div>
                          <h4 className={`font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            🏢 Company Name
                          </h4>
                          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {profileData.companyName}
                          </p>
                        </div>
                      )}
                      {profileData.companyDescription && (
                        <div>
                          <h4 className={`font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            📝 Company Description
                          </h4>
                          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {profileData.companyDescription}
                          </p>
                        </div>
                      )}
                      {profileData.companyWebsite && (
                        <div>
                          <h4 className={`font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            🌐 Company Website
                          </h4>
                          <a 
                            href={profileData.companyWebsite} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} font-medium`}
                          >
                            {profileData.companyWebsite}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Profile Edit Form */}
          {activeTab === 'edit' && (
            <div className="max-w-4xl mx-auto">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className={`
                  ${isDark ? 'bg-gray-800/70 backdrop-blur-md border-gray-700' : 'bg-white/80 backdrop-blur-md border-white/20'} 
                  p-8 rounded-3xl shadow-2xl border space-y-6
                `}
              >
                {/* Basic Information */}
                <div>
                  <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        First Name
                      </label>
                      <input
                        type="text"
                        {...register("firstName", { required: "First name is required" })}
                        className={`
                          w-full px-4 py-3 rounded-xl transition-all duration-300 border-2
                          ${isDark 
                            ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20' 
                            : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/20'
                          }
                          focus:outline-none focus:ring-4 backdrop-blur-sm
                        `}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-red-400 mt-2">{errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Last Name
                      </label>
                      <input
                        type="text"
                        {...register("lastName", { required: "Last name is required" })}
                        className={`
                          w-full px-4 py-3 rounded-xl transition-all duration-300 border-2
                          ${isDark 
                            ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20' 
                            : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/20'
                          }
                          focus:outline-none focus:ring-4 backdrop-blur-sm
                        `}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-red-400 mt-2">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Email
                      </label>
                      <input
                        type="email"
                        {...register("email", { required: "Email is required" })}
                        className={`
                          w-full px-4 py-3 rounded-xl transition-all duration-300 border-2
                          ${isDark 
                            ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20' 
                            : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/20'
                          }
                          focus:outline-none focus:ring-4 backdrop-blur-sm
                        `}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-400 mt-2">{errors.email.message}</p>
                      )}
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        {...register("phone")}
                        placeholder="Your phone number"
                        className={`
                          w-full px-4 py-3 rounded-xl transition-all duration-300 border-2
                          ${isDark 
                            ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20' 
                            : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/20'
                          }
                          focus:outline-none focus:ring-4 backdrop-blur-sm
                        `}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Location
                    </label>
                    <input
                      type="text"
                      {...register("location")}
                      placeholder="Your location"
                      className={`
                        w-full px-4 py-3 rounded-xl transition-all duration-300 border-2
                        ${isDark 
                          ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20' 
                          : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/20'
                        }
                        focus:outline-none focus:ring-4 backdrop-blur-sm
                      `}
                    />
                  </div>

                  <div className="mt-4">
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Bio
                    </label>
                    <textarea
                      {...register("bio")}
                      placeholder="Tell us about yourself..."
                      rows={3}
                      className={`
                        w-full px-4 py-3 rounded-xl transition-all duration-300 border-2 resize-none
                        ${isDark 
                          ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20' 
                          : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/20'
                        }
                        focus:outline-none focus:ring-4 backdrop-blur-sm
                      `}
                    />
                  </div>
                </div>

                {/* Links Section */}
                <div>
                  <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Links & Resume
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        LinkedIn URL
                      </label>
                      <input
                        type="url"
                        {...register("linkedinUrl")}
                        placeholder="https://linkedin.com/in/yourprofile"
                        className={`
                          w-full px-4 py-3 rounded-xl transition-all duration-300 border-2
                          ${isDark 
                            ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20' 
                            : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/20'
                          }
                          focus:outline-none focus:ring-4 backdrop-blur-sm
                        `}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        GitHub URL
                      </label>
                      <input
                        type="url"
                        {...register("githubUrl")}
                        placeholder="https://github.com/yourusername"
                        className={`
                          w-full px-4 py-3 rounded-xl transition-all duration-300 border-2
                          ${isDark 
                            ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20' 
                            : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/20'
                          }
                          focus:outline-none focus:ring-4 backdrop-blur-sm
                        `}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Portfolio URL
                      </label>
                      <input
                        type="url"
                        {...register("portfolioUrl")}
                        placeholder="https://yourportfolio.com"
                        className={`
                          w-full px-4 py-3 rounded-xl transition-all duration-300 border-2
                          ${isDark 
                            ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20' 
                            : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/20'
                          }
                          focus:outline-none focus:ring-4 backdrop-blur-sm
                        `}
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information for Job Seekers */}
                {userRole === 'job-seeker' && (
                  <div>
                    <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Professional Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Education
                        </label>
                        <input
                          type="text"
                          {...register("education")}
                          placeholder="Your education background"
                          className={`
                            w-full px-4 py-3 rounded-xl transition-all duration-300 border-2
                            ${isDark 
                              ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20' 
                              : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/20'
                            }
                            focus:outline-none focus:ring-4 backdrop-blur-sm
                          `}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Experience
                        </label>
                        <textarea
                          {...register("experience")}
                          placeholder="Your work experience"
                          rows={3}
                          className={`
                            w-full px-4 py-3 rounded-xl transition-all duration-300 border-2 resize-none
                            ${isDark 
                              ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20' 
                              : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/20'
                            }
                            focus:outline-none focus:ring-4 backdrop-blur-sm
                          `}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Skills (comma separated)
                        </label>
                        <input
                          type="text"
                          {...register("skills")}
                          placeholder="React, Node.js, Python, etc."
                          className={`
                            w-full px-4 py-3 rounded-xl transition-all duration-300 border-2
                            ${isDark 
                              ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20' 
                              : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/20'
                            }
                            focus:outline-none focus:ring-4 backdrop-blur-sm
                          `}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Company Information for Job Posters */}
                {userRole === 'job-poster' && (
                  <div>
                    <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Company Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Company Name
                        </label>
                        <input
                          type="text"
                          {...register("companyName")}
                          placeholder="Your company name"
                          className={`
                            w-full px-4 py-3 rounded-xl transition-all duration-300 border-2
                            ${isDark 
                              ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20' 
                              : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/20'
                            }
                            focus:outline-none focus:ring-4 backdrop-blur-sm
                          `}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Company Description
                        </label>
                        <textarea
                          {...register("companyDescription")}
                          placeholder="Describe your company"
                          rows={3}
                          className={`
                            w-full px-4 py-3 rounded-xl transition-all duration-300 border-2 resize-none
                            ${isDark 
                              ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20' 
                              : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/20'
                            }
                            focus:outline-none focus:ring-4 backdrop-blur-sm
                          `}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Company Website
                        </label>
                        <input
                          type="url"
                          {...register("companyWebsite")}
                          placeholder="https://yourcompany.com"
                          className={`
                            w-full px-4 py-3 rounded-xl transition-all duration-300 border-2
                            ${isDark 
                              ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20' 
                              : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-indigo-500/20'
                            }
                            focus:outline-none focus:ring-4 backdrop-blur-sm
                          `}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-center pt-6">
                  <AnimatedButton 
                    type="submit"
                    className="px-12 py-4 text-lg font-semibold"
                  >
                    💾 Update Profile
                  </AnimatedButton>
                </div>
              </form>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </GradientBackground>
  );
}

export default Profile;
