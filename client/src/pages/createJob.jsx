import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTheme } from "../contexts/ThemeContext";
import GradientBackground from "../components/GradientBackground";
import AnimatedButton from "../components/AnimatedButton";

export default function CreateJob() {
  const { isDark } = useTheme();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      console.log("Creating job with token:", token);
      const res = await axios.post(
        "http://localhost:5000/api/jobs",
        {
          ...data,
          skillsRequired: data.skillsRequired.split(",").map((s) => s.trim()),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("✅ Job Created:", res.data);
      alert("Job created successfully!");
      reset();
      navigate("/home");
    } catch (error) {
      console.error("❌ Error:", error);
      if (error.response?.status === 401) {
        console.log("Token is invalid, redirecting to login");
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/";
      } else {
        alert("Failed to create job. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GradientBackground variant="default">
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center px-4 py-10">
        <h2 className={`
          text-4xl md:text-5xl font-bold mb-8 text-center animate-float
          bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent
          ${isDark ? 'from-purple-400 via-blue-400 to-purple-600' : ''}
        `}>
          Create New Job ✨
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`
            ${isDark ? 'bg-gray-800/70 backdrop-blur-md border-gray-700' : 'bg-white/80 backdrop-blur-md border-white/20'} 
            p-10 rounded-3xl shadow-2xl w-full max-w-3xl space-y-6 border
          `}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <input
                type="text"
                placeholder="Job Title"
                {...register("jobTitle", { required: "Job title is required" })}
                className={`
                  w-full px-6 py-4 rounded-2xl transition-all duration-300 border-2
                  ${isDark 
                    ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20' 
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/20'
                  }
                  focus:outline-none focus:ring-4 backdrop-blur-sm
                `}
              />
              {errors.jobTitle && (
                <p className="text-sm text-red-400 mt-2 font-medium">{errors.jobTitle.message}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                placeholder="Company Name"
                {...register("company", { required: "Company name is required" })}
                className={`
                  w-full px-6 py-4 rounded-2xl transition-all duration-300 border-2
                  ${isDark 
                    ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20' 
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/20'
                  }
                  focus:outline-none focus:ring-4 backdrop-blur-sm
                `}
              />
              {errors.company && (
                <p className="text-sm text-red-400 mt-2 font-medium">{errors.company.message}</p>
              )}
            </div>
          </div>

          <input
            type="text"
            placeholder="Location"
            {...register("location")}
            className={`
              w-full px-6 py-4 rounded-2xl transition-all duration-300 border-2
              ${isDark 
                ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20' 
                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/20'
              }
              focus:outline-none focus:ring-4 backdrop-blur-sm
            `}
          />

          <textarea
            placeholder="Job Description"
            {...register("jobDescription", { required: "Job description is required" })}
            rows={4}
            className={`
              w-full px-6 py-4 rounded-2xl transition-all duration-300 border-2 resize-none
              ${isDark 
                ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20' 
                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/20'
              }
              focus:outline-none focus:ring-4 backdrop-blur-sm
            `}
          />
          {errors.jobDescription && (
            <p className="text-sm text-red-400 mt-2 font-medium">{errors.jobDescription.message}</p>
          )}

          <input
            type="text"
            placeholder="Skills Required (comma separated)"
            {...register("skillsRequired", { required: "Skills are required" })}
            className={`
              w-full px-6 py-4 rounded-2xl transition-all duration-300 border-2
              ${isDark 
                ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20' 
                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/20'
              }
              focus:outline-none focus:ring-4 backdrop-blur-sm
            `}
          />
          {errors.skillsRequired && (
            <p className="text-sm text-red-400 mt-2 font-medium">{errors.skillsRequired.message}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <input
                type="text"
                placeholder="Salary Range (e.g., $50,000 - $70,000)"
                {...register("salaryRange")}
                className={`
                  w-full px-6 py-4 rounded-2xl transition-all duration-300 border-2
                  ${isDark 
                    ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20' 
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/20'
                  }
                  focus:outline-none focus:ring-4 backdrop-blur-sm
                `}
              />
            </div>

            <div>
              <select
                {...register("jobType", { required: "Job type is required" })}
                className={`
                  w-full px-6 py-4 rounded-2xl transition-all duration-300 border-2
                  ${isDark 
                    ? 'bg-gray-700/50 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500/20' 
                    : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500/20'
                  }
                  focus:outline-none focus:ring-4 backdrop-blur-sm
                `}
              >
                <option value="">Select Job Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
              </select>
              {errors.jobType && (
                <p className="text-sm text-red-400 mt-2 font-medium">{errors.jobType.message}</p>
              )}
            </div>
          </div>

          <AnimatedButton
            type="submit"
            disabled={isLoading}
            className="w-full text-xl py-6 mt-4"
          >
            {isLoading ? "Creating Job... ⏳" : "Create Job 🚀"}
          </AnimatedButton>
        </form>
      </main>
      <Footer />
      </div>
    </GradientBackground>
  );
}
