import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function SearchAndFilter({ jobs, onFilteredJobs }) {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');

  // Get unique values for filters
  const locations = [...new Set(jobs.map(job => job.location).filter(Boolean))];
  const jobTypes = [...new Set(jobs.map(job => job.jobType).filter(Boolean))];
  const experienceLevels = [...new Set(jobs.map(job => job.experience).filter(Boolean))];

  const applyFilters = () => {
    let filteredJobs = jobs;

    // Search filter
    if (searchTerm) {
      filteredJobs = filteredJobs.filter(job =>
        job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Location filter
    if (locationFilter) {
      filteredJobs = filteredJobs.filter(job => job.location === locationFilter);
    }

    // Job type filter
    if (jobTypeFilter) {
      filteredJobs = filteredJobs.filter(job => job.jobType === jobTypeFilter);
    }

    // Experience filter
    if (experienceFilter) {
      filteredJobs = filteredJobs.filter(job => job.experience === experienceFilter);
    }

    onFilteredJobs(filteredJobs);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setLocationFilter('');
    setJobTypeFilter('');
    setExperienceFilter('');
    onFilteredJobs(jobs);
  };

  React.useEffect(() => {
    applyFilters();
  }, [searchTerm, locationFilter, jobTypeFilter, experienceFilter, jobs]);

  return (
    <div className={`
      ${isDark ? 'bg-gray-800/50 backdrop-blur-md border-gray-700' : 'bg-white/80 backdrop-blur-md border-white/20'} 
      rounded-2xl p-6 shadow-xl border mb-8 max-w-6xl mx-auto
    `}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search Input */}
        <div className="lg:col-span-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-xl">🔍</span>
            </div>
            <input
              type="text"
              placeholder="Search jobs, companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`
                w-full pl-12 pr-4 py-3 rounded-xl transition-all duration-300 border-2
                ${isDark 
                  ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/20'
                }
                focus:outline-none focus:ring-4 backdrop-blur-sm
              `}
            />
          </div>
        </div>

        {/* Location Filter */}
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className={`
            px-4 py-3 rounded-xl transition-all duration-300 border-2
            ${isDark 
              ? 'bg-gray-700/50 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500/20' 
              : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500/20'
            }
            focus:outline-none focus:ring-4 backdrop-blur-sm cursor-pointer
          `}
        >
          <option value="">📍 All Locations</option>
          {locations.map(location => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>

        {/* Job Type Filter */}
        <select
          value={jobTypeFilter}
          onChange={(e) => setJobTypeFilter(e.target.value)}
          className={`
            px-4 py-3 rounded-xl transition-all duration-300 border-2
            ${isDark 
              ? 'bg-gray-700/50 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500/20' 
              : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500/20'
            }
            focus:outline-none focus:ring-4 backdrop-blur-sm cursor-pointer
          `}
        >
          <option value="">💼 All Types</option>
          {jobTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        {/* Experience Filter */}
        <select
          value={experienceFilter}
          onChange={(e) => setExperienceFilter(e.target.value)}
          className={`
            px-4 py-3 rounded-xl transition-all duration-300 border-2
            ${isDark 
              ? 'bg-gray-700/50 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500/20' 
              : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500/20'
            }
            focus:outline-none focus:ring-4 backdrop-blur-sm cursor-pointer
          `}
        >
          <option value="">🎯 All Levels</option>
          {experienceLevels.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>

      {/* Clear Filters Button */}
      {(searchTerm || locationFilter || jobTypeFilter || experienceFilter) && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={clearFilters}
            className={`
              px-6 py-2 rounded-lg transition-all duration-300 font-medium
              ${isDark 
                ? 'bg-gray-700 text-purple-300 hover:bg-gray-600 border border-gray-600' 
                : 'bg-gray-100 text-indigo-600 hover:bg-gray-200 border border-gray-300'
              }
            `}
          >
            ✨ Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
