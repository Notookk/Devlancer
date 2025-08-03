import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GradientBackground from '../components/GradientBackground';
import AnimatedButton from '../components/AnimatedButton';

export default function ApplicationManagement() {
  const { isDark } = useTheme();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'approve', 'reject', 'message'
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');
  
  const token = localStorage.getItem('token');
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
    if (token && userRole === 'job-poster') {
      fetchApplications();
    }
  }, [token, userRole]);

  const fetchApplications = async () => {
    try {
      console.log("Fetching applications with token:", token);
      const response = await axios.get('http://localhost:5000/api/applications/my-job-applications', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setApplications(response.data.applications || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      if (error.response?.status === 401) {
        console.log("Token is invalid, redirecting to login");
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/applications/${applicationId}/status`,
        { status, notes },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app._id === applicationId 
            ? { ...app, status, notes, reviewedAt: new Date() }
            : app
        )
      );
      
      setShowModal(false);
      setNotes('');
      alert(`Application ${status} successfully!`);
    } catch (error) {
      console.error('Error updating application:', error);
      alert('Failed to update application status');
    }
  };

  const handleSendMessage = async (applicationId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/applications/${applicationId}/message`,
        { content: message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setShowModal(false);
      setMessage('');
      alert('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  const openModal = (application, type) => {
    setSelectedApplication(application);
    setModalType(type);
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return isDark ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'accepted':
        return isDark ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-green-100 text-green-700 border-green-300';
      case 'rejected':
        return isDark ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-red-100 text-red-700 border-red-300';
      default:
        return isDark ? 'bg-gray-500/20 text-gray-300 border-gray-500/30' : 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'accepted': return '✅';
      case 'rejected': return '❌';
      default: return '📄';
    }
  };

  const filteredApplications = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status === filter);

  if (userRole !== 'job-poster') {
    return (
      <GradientBackground variant="default">
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl mb-6">🚫</div>
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Access Denied
              </h2>
              <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Only job posters can access this page.
              </p>
            </div>
          </main>
          <Footer />
        </div>
      </GradientBackground>
    );
  }

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
                Loading applications...
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
          <div className="text-center mb-12">
            <h1 className={`
              text-5xl md:text-6xl font-bold mb-6 animate-float
              bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent
              ${isDark ? 'from-purple-400 via-blue-400 to-purple-600' : ''}
            `}>
              Application Management 📋
            </h1>
            <p className={`text-xl md:text-2xl max-w-3xl mx-auto mb-8 font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Review and manage applications for your job postings 🎯
            </p>
          </div>

          {/* Filters */}
          <div className="flex justify-center mb-8">
            <div className={`
              ${isDark ? 'bg-gray-800/50 backdrop-blur-md' : 'bg-white/70 backdrop-blur-md'} 
              rounded-2xl p-2 shadow-xl border 
              ${isDark ? 'border-gray-700' : 'border-white/20'}
            `}>
              {['all', 'pending', 'accepted', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-6 py-3 rounded-xl transition-all duration-300 font-medium capitalize ${
                    filter === status
                      ? `bg-gradient-to-r ${isDark ? 'from-purple-500 to-blue-500' : 'from-indigo-600 to-purple-600'} text-white shadow-lg transform scale-105`
                      : `${isDark ? 'text-purple-300 hover:bg-purple-500/20' : 'text-indigo-600 hover:bg-indigo-50'}`
                  }`}
                >
                  {getStatusIcon(status)} {status} ({
                    status === 'all' ? applications.length : applications.filter(app => app.status === status).length
                  })
                </button>
              ))}
            </div>
          </div>

          {/* Applications Grid */}
          <div className="max-w-7xl mx-auto">
            {filteredApplications.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-8xl mb-6 animate-float">📭</div>
                <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {filter === 'all' ? 'No applications yet' : `No ${filter} applications`}
                </h3>
                <p className={`text-lg mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {filter === 'all' 
                    ? 'Applications will appear here when candidates apply to your jobs! 🎯'
                    : `You don't have any ${filter} applications at the moment.`
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredApplications.map((application) => (
                  <div
                    key={application._id}
                    className={`
                      ${isDark ? 'bg-gray-800/60' : 'bg-white/60'} 
                      backdrop-blur-xl rounded-3xl p-6 
                      border ${isDark ? 'border-gray-700/50' : 'border-white/50'}
                      shadow-xl ${isDark ? 'shadow-purple-500/10' : 'shadow-indigo-500/10'}
                      hover:shadow-2xl ${isDark ? 'hover:shadow-purple-500/20' : 'hover:shadow-indigo-500/20'}
                      transition-all duration-500 animate-float
                    `}
                  >
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Applicant Info */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {application.applicant.firstName} {application.applicant.lastName}
                            </h3>
                            <p className={`text-lg font-semibold ${isDark ? 'text-purple-300' : 'text-indigo-600'}`}>
                              Applied for: {application.job.jobTitle}
                            </p>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              📧 {application.applicant.email}
                            </p>
                            {application.applicant.phone && (
                              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                📞 {application.applicant.phone}
                              </p>
                            )}
                          </div>
                          <span className={`
                            px-3 py-1 rounded-xl text-sm font-semibold border
                            ${getStatusColor(application.status)}
                          `}>
                            {getStatusIcon(application.status)} {application.status}
                          </span>
                        </div>

                        {/* Skills */}
                        {application.applicant.skills && application.applicant.skills.length > 0 && (
                          <div className="mb-4">
                            <p className={`font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              Skills:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {application.applicant.skills.map((skill, index) => (
                                <span
                                  key={index}
                                  className={`
                                    px-3 py-1 rounded-lg text-sm
                                    ${isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-indigo-100 text-indigo-700'}
                                  `}
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Links */}
                        <div className="flex flex-wrap gap-4 mb-4">
                          {application.applicant.resume && (
                            <a
                              href={application.applicant.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-sm ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} font-medium`}
                            >
                              📄 Resume
                            </a>
                          )}
                          {application.applicant.linkedinUrl && (
                            <a
                              href={application.applicant.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-sm ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} font-medium`}
                            >
                              💼 LinkedIn
                            </a>
                          )}
                          {application.applicant.githubUrl && (
                            <a
                              href={application.applicant.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-sm ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} font-medium`}
                            >
                              🔗 GitHub
                            </a>
                          )}
                          {application.applicant.portfolioUrl && (
                            <a
                              href={application.applicant.portfolioUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-sm ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} font-medium`}
                            >
                              🌐 Portfolio
                            </a>
                          )}
                        </div>

                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Applied on {new Date(application.createdAt).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-3 lg:w-48">
                        {application.status === 'pending' && (
                          <>
                            <AnimatedButton
                              onClick={() => openModal(application, 'approve')}
                              className="w-full text-sm px-4 py-2 bg-green-600 hover:bg-green-700"
                            >
                              ✅ Approve
                            </AnimatedButton>
                            <AnimatedButton
                              onClick={() => openModal(application, 'reject')}
                              className="w-full text-sm px-4 py-2 bg-red-600 hover:bg-red-700"
                            >
                              ❌ Reject
                            </AnimatedButton>
                          </>
                        )}
                        <AnimatedButton
                          onClick={() => openModal(application, 'message')}
                          className="w-full text-sm px-4 py-2"
                        >
                          💬 Message
                        </AnimatedButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
        <Footer />

        {/* Modal */}
        {showModal && selectedApplication && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`
              ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
              rounded-2xl p-6 max-w-md w-full border shadow-2xl
            `}>
              <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {modalType === 'approve' && '✅ Approve Application'}
                {modalType === 'reject' && '❌ Reject Application'}
                {modalType === 'message' && '💬 Send Message'}
              </h3>

              {(modalType === 'approve' || modalType === 'reject') && (
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Notes (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes about your decision..."
                    className={`
                      w-full px-3 py-2 rounded-lg border
                      ${isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }
                      focus:outline-none focus:ring-2 focus:ring-purple-500
                    `}
                    rows={3}
                  />
                </div>
              )}

              {modalType === 'message' && (
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message to the applicant..."
                    className={`
                      w-full px-3 py-2 rounded-lg border
                      ${isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }
                      focus:outline-none focus:ring-2 focus:ring-purple-500
                    `}
                    rows={4}
                    required
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className={`
                    flex-1 px-4 py-2 rounded-lg font-medium transition-colors
                    ${isDark 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }
                  `}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (modalType === 'approve') {
                      handleStatusUpdate(selectedApplication._id, 'accepted');
                    } else if (modalType === 'reject') {
                      handleStatusUpdate(selectedApplication._id, 'rejected');
                    } else if (modalType === 'message') {
                      handleSendMessage(selectedApplication._id);
                    }
                  }}
                  className={`
                    flex-1 px-4 py-2 rounded-lg font-medium text-white transition-colors
                    ${modalType === 'approve' ? 'bg-green-600 hover:bg-green-700' : 
                      modalType === 'reject' ? 'bg-red-600 hover:bg-red-700' : 
                      'bg-purple-600 hover:bg-purple-700'
                    }
                  `}
                  disabled={modalType === 'message' && !message.trim()}
                >
                  {modalType === 'approve' && '✅ Approve'}
                  {modalType === 'reject' && '❌ Reject'}
                  {modalType === 'message' && '📤 Send'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </GradientBackground>
  );
}
