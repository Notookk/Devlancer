import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useTheme } from "../contexts/ThemeContext";
import GradientBackground from "../components/GradientBackground";
import AnimatedButton from "../components/AnimatedButton";

export default function Profile() {
  const { isDark } = useTheme();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('edit'); // 'edit' or 'view'
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

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
    if (!token || !userId) return;

    try {
      const fetchProfile = async () => {
        try {
          console.log("Fetching profile with token:", token);
          const res = await axios.get(
            `http://localhost:5000/api/auth/all-users/${userId}`,
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
      navigate("/home");
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
            Update Profile ✨
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={`
              ${isDark ? 'bg-gray-800/70 backdrop-blur-md border-gray-700' : 'bg-white/80 backdrop-blur-md border-white/20'} 
              p-10 rounded-3xl shadow-2xl w-full max-w-2xl space-y-6 border
            `}
          >
            <input
              type="text"
              placeholder="Phone Number"
              {...register("phone")}
              className={`
                w-full px-6 py-4 rounded-2xl transition-all duration-300 border-2
                ${isDark 
                  ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/20'
                }
                focus:outline-none focus:ring-4 backdrop-blur-sm
              `}
            />
            {errors.phone && (
              <p className="text-sm text-red-400 mt-2 font-medium">Phone Number is required</p>
            )}

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
            {errors.location && (
              <p className="text-sm text-red-400 mt-2 font-medium">Location is required</p>
            )}

            <input
              type="text"
              placeholder="Education Qualification"
              {...register("education")}
              className={`
                w-full px-6 py-4 rounded-2xl transition-all duration-300 border-2
                ${isDark 
                  ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/20'
                }
                focus:outline-none focus:ring-4 backdrop-blur-sm
              `}
            />
            {errors.education && (
              <p className="text-sm text-red-400 mt-2 font-medium">
                Education Qualification is required
              </p>
            )}

            <input
              type="text"
              placeholder="Experience"
              {...register("experience")}
              className={`
                w-full px-6 py-4 rounded-2xl transition-all duration-300 border-2
                ${isDark 
                  ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/20'
                }
                focus:outline-none focus:ring-4 backdrop-blur-sm
              `}
            />
            {errors.experience && (
              <p className="text-sm text-red-400 mt-2 font-medium">Experience is required</p>
            )}

            <textarea
              placeholder="Skills (comma separated)"
              {...register("skills")}
              rows={3}
              className={`
                w-full px-6 py-4 rounded-2xl transition-all duration-300 border-2 resize-none
                ${isDark 
                  ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/20'
                }
                focus:outline-none focus:ring-4 backdrop-blur-sm
              `}
            />
            {errors.skills && (
              <p className="text-sm text-red-400 mt-2 font-medium">Skills required</p>
            )}

            <AnimatedButton
              type="submit"
              className="w-full text-xl py-6 mt-4"
            >
              Update Profile 🔄
            </AnimatedButton>
        </form>
      </main>
      <Footer />
      </div>
    </GradientBackground>
  );
}
