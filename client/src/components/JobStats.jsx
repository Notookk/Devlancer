import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function JobStats({ jobs, myJobs, userRole }) {
  const { isDark } = useTheme();

  const getStats = () => {
    if (userRole === 'job-poster') {
      return [
        {
          label: 'Total Jobs Posted',
          value: myJobs.length,
          icon: '📝',
          color: isDark ? 'from-purple-500 to-blue-500' : 'from-indigo-500 to-purple-500',
        },
        {
          label: 'Active Positions',
          value: myJobs.filter(job => job.status !== 'closed').length,
          icon: '✨',
          color: isDark ? 'from-green-500 to-teal-500' : 'from-green-500 to-emerald-500',
        },
        {
          label: 'Market Jobs',
          value: jobs.length,
          icon: '🌐',
          color: isDark ? 'from-orange-500 to-red-500' : 'from-orange-500 to-pink-500',
        },
      ];
    } else {
      return [
        {
          label: 'Available Jobs',
          value: jobs.length,
          icon: '💼',
          color: isDark ? 'from-purple-500 to-blue-500' : 'from-indigo-500 to-purple-500',
        },
        {
          label: 'Remote Opportunities',
          value: jobs.filter(job => job.jobType === 'Remote' || job.location?.toLowerCase().includes('remote')).length,
          icon: '🏠',
          color: isDark ? 'from-green-500 to-teal-500' : 'from-green-500 to-emerald-500',
        },
        {
          label: 'Full-time Positions',
          value: jobs.filter(job => job.jobType === 'Full-time').length,
          icon: '⚡',
          color: isDark ? 'from-orange-500 to-red-500' : 'from-orange-500 to-pink-500',
        },
      ];
    }
  };

  const stats = getStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`
            ${isDark ? 'bg-gray-800/50 backdrop-blur-md border-gray-700' : 'bg-white/80 backdrop-blur-md border-white/20'}
            rounded-2xl p-6 shadow-xl border transform hover:scale-105 transition-all duration-300
            animate-float
          `}
          style={{ animationDelay: `${index * 0.2}s` }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {stat.label}
              </p>
              <p className={`text-3xl font-bold mt-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </p>
            </div>
            <div className="text-4xl opacity-80">
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
