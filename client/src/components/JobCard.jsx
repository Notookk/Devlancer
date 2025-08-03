import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import AnimatedButton from "./AnimatedButton";

export default function JobCard({ job, onDelete, showActions = false }) {
  const { isDark } = useTheme();
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getJobTypeIcon = (type) => {
    switch (type) {
      case 'Full-time': return '💼';
      case 'Part-time': return '⏰';
      case 'Contract': return '📝';
      case 'Remote': return '🌐';
      default: return '💼';
    }
  };

  const getJobTypeColor = (type) => {
    switch (type) {
      case 'Full-time': return 'from-blue-500 to-blue-600';
      case 'Part-time': return 'from-green-500 to-green-600';
      case 'Contract': return 'from-orange-500 to-orange-600';
      case 'Remote': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className={`
      group relative overflow-hidden
      ${isDark ? 'bg-gray-800/60' : 'bg-white/60'} 
      backdrop-blur-xl rounded-3xl p-6 
      border ${isDark ? 'border-gray-700/50' : 'border-white/50'}
      shadow-xl ${isDark ? 'shadow-purple-500/10' : 'shadow-indigo-500/10'}
      hover:shadow-2xl ${isDark ? 'hover:shadow-purple-500/20' : 'hover:shadow-indigo-500/20'}
      transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2
      animate-float
    `}>
      {/* Animated background gradient */}
      <div className={`
        absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500
        bg-gradient-to-br ${isDark ? 'from-purple-600/30 to-blue-600/30' : 'from-indigo-600/30 to-purple-600/30'}
        rounded-3xl
      `} />

      {/* Sparkle animation on hover */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="animate-pulse text-2xl">✨</div>
      </div>
      
      {/* Actions (for job owner) */}
      {showActions && (
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => onDelete?.(job._id)}
            className={`
              p-2 rounded-full transition-all duration-300 transform hover:scale-110
              ${isDark ? 'bg-red-600/80 hover:bg-red-500' : 'bg-red-500/80 hover:bg-red-600'}
              text-white shadow-lg
            `}
            title="Delete Job"
          >
            🗑️
          </button>
        </div>
      )}

      {/* Header */}
      <div className="relative z-10 mb-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className={`
              text-xl font-bold mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r 
              ${isDark 
                ? 'text-white group-hover:from-purple-400 group-hover:to-blue-400' 
                : 'text-gray-800 group-hover:from-indigo-600 group-hover:to-purple-600'
              }
              group-hover:bg-clip-text transition-all duration-300
            `}>
              {job.jobTitle}
            </h3>
            <p className={`font-semibold text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {job.company}
            </p>
          </div>
          
          {/* Job Type Badge */}
          <div className={`
            flex items-center gap-2 px-3 py-2 rounded-full text-sm font-bold text-white
            bg-gradient-to-r ${getJobTypeColor(job.jobType)}
            shadow-lg transform group-hover:scale-110 transition-transform duration-300
          `}>
            <span>{getJobTypeIcon(job.jobType)}</span>
            <span>{job.jobType}</span>
          </div>
        </div>

        {/* Location */}
        {job.location && (
          <div className={`flex items-center gap-2 mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <span className="text-lg">📍</span>
            <span className="font-medium">{job.location}</span>
          </div>
        )}
      </div>

      {/* Description */}
      {job.description && (
        <div className="relative z-10 mb-4">
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
            {job.description.length > 120
              ? `${job.description.substring(0, 120)}...`
              : job.description}
          </p>
        </div>
      )}

      {/* Skills */}
      {job.skillsRequired && job.skillsRequired.length > 0 && (
        <div className="relative z-10 mb-4">
          <div className="flex flex-wrap gap-2">
            {job.skillsRequired.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className={`
                  px-3 py-1 rounded-full text-xs font-semibold
                  ${isDark 
                    ? 'bg-blue-600/30 text-blue-300 border border-blue-500/30' 
                    : 'bg-blue-100 text-blue-700 border border-blue-200'
                  }
                  hover:scale-105 transition-transform duration-200
                `}
              >
                {skill}
              </span>
            ))}
            {job.skillsRequired.length > 4 && (
              <span className={`
                px-3 py-1 rounded-full text-xs font-semibold
                ${isDark ? 'text-gray-400' : 'text-gray-500'}
              `}>
                +{job.skillsRequired.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="relative z-10 flex justify-between items-center pt-4 border-t border-gray-200/20 dark:border-gray-700/30">
        <div>
          {job.salaryRange && (
            <p className={`
              font-bold text-lg mb-1
              bg-gradient-to-r ${isDark ? 'from-emerald-400 to-teal-400' : 'from-emerald-600 to-teal-600'}
              bg-clip-text text-transparent
            `}>
              {job.salaryRange}
            </p>
          )}
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Posted {formatDate(job.createdAt)}
          </p>
        </div>
        
        <AnimatedButton
          variant="primary"
          size="sm"
          className="group-hover:scale-110 transition-transform duration-300"
        >
          <Link to={`/job/${job._id}`} className="flex items-center gap-2">
            View Details
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </Link>
        </AnimatedButton>
      </div>

      {/* Hover glow effect */}
      <div className={`
        absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
        bg-gradient-to-r ${isDark ? 'from-purple-600/10 to-blue-600/10' : 'from-indigo-600/10 to-purple-600/10'}
        blur-xl
      `} />
    </div>
  );
}
