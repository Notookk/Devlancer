import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GradientBackground from '../components/GradientBackground';
import AnimatedButton from '../components/AnimatedButton';

export default function Notifications() {
  const { isDark } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
    if (token) {
      fetchNotifications();
    }
  }, [token, filter, currentPage]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const unreadOnly = filter === 'unread';
      const response = await axios.get(`http://localhost:5000/api/notifications?page=${currentPage}&unreadOnly=${unreadOnly}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications(response.data.notifications);
      setTotalPages(response.data.totalPages);
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/';
      }
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${notificationId}/read`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update local state
      setNotifications(notifications.map(notif => 
        notif._id === notificationId 
          ? { ...notif, isRead: true, readAt: new Date() }
          : notif
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put('http://localhost:5000/api/notifications/mark-all-read', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications(notifications.map(notif => ({
        ...notif,
        isRead: true,
        readAt: new Date()
      })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`http://localhost:5000/api/notifications/${notificationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications(notifications.filter(notif => notif._id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const openNotificationModal = async (notification) => {
    setSelectedNotification(notification);
    setShowModal(true);
    if (!notification.isRead) {
      markAsRead(notification._id);
    }

    // If this is a message notification, fetch the actual message content
    if (notification.type === 'message_received' && notification.relatedId && notification.relatedModel === 'Message') {
      try {
        const response = await axios.get(`http://localhost:5000/api/applications/message/${notification.relatedId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.data.messageData) {
          // Update the selected notification with the actual message content
          setSelectedNotification({
            ...notification,
            actualMessageContent: response.data.messageData.content,
            messageSender: response.data.messageData.sender,
            messageApplication: response.data.messageData.application
          });
        }
      } catch (error) {
        console.error('Error fetching message content:', error);
        // Continue with the notification as is if we can't fetch the message
      }
    }
  };

  const closeNotificationModal = () => {
    setSelectedNotification(null);
    setShowModal(false);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'application_status': return '📋';
      case 'message_received': return '💬';
      case 'job_posted': return '📝';
      case 'application_received': return '📥';
      default: return '🔔';
    }
  };

  const getNotificationColor = (type, isRead) => {
    const baseColors = {
      'application_status': isRead ? 'from-blue-400 to-blue-600' : 'from-blue-500 to-blue-700',
      'message_received': isRead ? 'from-green-400 to-green-600' : 'from-green-500 to-green-700',
      'job_posted': isRead ? 'from-purple-400 to-purple-600' : 'from-purple-500 to-purple-700',
      'application_received': isRead ? 'from-orange-400 to-orange-600' : 'from-orange-500 to-orange-700',
    };
    return baseColors[type] || (isRead ? 'from-gray-400 to-gray-600' : 'from-gray-500 to-gray-700');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
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
                Loading notifications...
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
              Notifications 🔔
            </h1>
            <p className={`text-xl max-w-2xl mx-auto mb-8 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Stay updated with your application status and messages
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              {/* Filter Tabs */}
              <div className={`
                ${isDark ? 'bg-gray-800/50 backdrop-blur-md' : 'bg-white/70 backdrop-blur-md'} 
                rounded-2xl p-2 shadow-xl border 
                ${isDark ? 'border-gray-700' : 'border-white/20'}
              `}>
                {['all', 'unread', 'read'].map((filterType) => (
                  <button
                    key={filterType}
                    onClick={() => {
                      setFilter(filterType);
                      setCurrentPage(1);
                    }}
                    className={`px-6 py-2 rounded-xl transition-all duration-300 font-medium capitalize ${
                      filter === filterType
                        ? `bg-gradient-to-r ${isDark ? 'from-purple-500 to-blue-500' : 'from-indigo-600 to-purple-600'} text-white shadow-lg transform scale-105`
                        : `${isDark ? 'text-purple-300 hover:bg-purple-500/20' : 'text-indigo-600 hover:bg-indigo-50'}`
                    }`}
                  >
                    {filterType} {filterType === 'unread' && unreadCount > 0 && `(${unreadCount})`}
                  </button>
                ))}
              </div>

              {/* Mark All Read Button */}
              {unreadCount > 0 && (
                <AnimatedButton
                  onClick={markAllAsRead}
                  className="text-sm px-4 py-2"
                >
                  ✅ Mark All Read
                </AnimatedButton>
              )}
            </div>

            {/* Notifications List */}
            {notifications.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-8xl mb-6 animate-float">
                  {filter === 'unread' ? '📭' : '🔔'}
                </div>
                <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                </h3>
                <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {filter === 'unread' 
                    ? 'All caught up! 🎉' 
                    : 'Notifications about your applications and messages will appear here.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`
                      ${isDark ? 'bg-gray-800/70 backdrop-blur-md border-gray-700' : 'bg-white/80 backdrop-blur-md border-white/20'}
                      rounded-2xl p-6 shadow-lg border transition-all duration-300 hover:scale-[1.02] cursor-pointer
                      ${!notification.isRead ? 'ring-2 ring-blue-500/50' : ''}
                    `}
                    onClick={() => openNotificationModal(notification)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        {/* Icon */}
                        <div className={`
                          w-12 h-12 rounded-xl bg-gradient-to-r ${getNotificationColor(notification.type, notification.isRead)}
                          flex items-center justify-center text-2xl shadow-lg
                        `}>
                          {getNotificationIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {notification.title}
                            </h3>
                            {!notification.isRead && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                          </div>
                          
                          <p className={`mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            {notification.message}
                          </p>

                          {/* Additional Data */}
                          {notification.data && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {notification.data.jobTitle && (
                                <span className={`
                                  px-3 py-1 rounded-lg text-sm font-medium
                                  ${isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-indigo-100 text-indigo-700'}
                                `}>
                                  📋 {notification.data.jobTitle}
                                </span>
                              )}
                              {notification.data.companyName && (
                                <span className={`
                                  px-3 py-1 rounded-lg text-sm font-medium
                                  ${isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'}
                                `}>
                                  🏢 {notification.data.companyName}
                                </span>
                              )}
                            </div>
                          )}

                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {formatDate(notification.createdAt)}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2 ml-4">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification._id)}
                            className={`
                              p-2 rounded-lg transition-colors duration-200
                              ${isDark ? 'hover:bg-green-500/20 text-green-400' : 'hover:bg-green-50 text-green-600'}
                            `}
                            title="Mark as read"
                          >
                            ✅
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification._id)}
                          className={`
                            p-2 rounded-lg transition-colors duration-200
                            ${isDark ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-600'}
                          `}
                          title="Delete notification"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`
                    px-4 py-2 rounded-lg transition-all duration-200
                    ${currentPage === 1
                      ? `${isDark ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400'} cursor-not-allowed`
                      : `${isDark ? 'bg-purple-600 hover:bg-purple-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white`
                    }
                  `}
                >
                  Previous
                </button>
                
                <span className={`px-4 py-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`
                    px-4 py-2 rounded-lg transition-all duration-200
                    ${currentPage === totalPages
                      ? `${isDark ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400'} cursor-not-allowed`
                      : `${isDark ? 'bg-purple-600 hover:bg-purple-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white`
                    }
                  `}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>

      {/* Notification Detail Modal */}
      {showModal && selectedNotification && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closeNotificationModal}
        >
          <div 
            className={`
              ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
              rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border
            `}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className={`
                  w-16 h-16 rounded-xl bg-gradient-to-r ${getNotificationColor(selectedNotification.type, false)}
                  flex items-center justify-center text-3xl shadow-lg
                `}>
                  {getNotificationIcon(selectedNotification.type)}
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {selectedNotification.title}
                  </h2>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {formatDate(selectedNotification.createdAt)}
                  </p>
                </div>
              </div>
              <button
                onClick={closeNotificationModal}
                className={`
                  p-2 rounded-lg transition-colors duration-200
                  ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}
                `}
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-6">
              {/* Notification Summary */}
              <div>
                <h3 className={`font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Notification:
                </h3>
                <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                  {selectedNotification.message}
                </p>
              </div>

              {/* Actual Message Content (for message notifications) */}
              {selectedNotification.actualMessageContent && (
                <div>
                  <h3 className={`font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    📧 Message from {selectedNotification.messageSender?.firstName} {selectedNotification.messageSender?.lastName}:
                  </h3>
                  <div className={`
                    p-4 rounded-lg border-l-4 
                    ${isDark ? 'bg-blue-500/10 border-l-blue-400 text-blue-200' : 'bg-blue-50 border-l-blue-500 text-blue-800'}
                  `}>
                    <p className="text-lg leading-relaxed font-medium">
                      "{selectedNotification.actualMessageContent}"
                    </p>
                  </div>
                  {selectedNotification.messageApplication?.job && (
                    <div className={`mt-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      💼 Regarding your application for: <span className="font-medium">{selectedNotification.messageApplication.job.jobTitle}</span>
                      {selectedNotification.messageApplication.job.company && (
                        <span> at <span className="font-medium">{selectedNotification.messageApplication.job.company}</span></span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Approval/Rejection Message (for application status notifications) */}
              {selectedNotification.type === 'application_status' && selectedNotification.data?.approvalMessage && (
                <div>
                  <h3 className={`font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    💬 Message from Employer:
                  </h3>
                  <div className={`
                    p-4 rounded-lg border-l-4 
                    ${selectedNotification.data.applicationStatus === 'accepted'
                      ? (isDark ? 'bg-green-500/10 border-l-green-400 text-green-200' : 'bg-green-50 border-l-green-500 text-green-800')
                      : (isDark ? 'bg-red-500/10 border-l-red-400 text-red-200' : 'bg-red-50 border-l-red-500 text-red-800')
                    }
                  `}>
                    <p className="text-lg leading-relaxed font-medium">
                      "{selectedNotification.data.approvalMessage}"
                    </p>
                  </div>
                </div>
              )}

              {/* Additional Details */}
              {selectedNotification.data && Object.keys(selectedNotification.data).length > 0 && (
                <div>
                  <h3 className={`font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Details:
                  </h3>
                  <div className="space-y-2">
                    {selectedNotification.data.jobTitle && (
                      <div className={`
                        p-3 rounded-lg 
                        ${isDark ? 'bg-purple-500/20 border-purple-500/30' : 'bg-indigo-50 border-indigo-200'} 
                        border
                      `}>
                        <span className={`font-medium ${isDark ? 'text-purple-300' : 'text-indigo-700'}`}>
                          📋 Job: {selectedNotification.data.jobTitle}
                        </span>
                      </div>
                    )}
                    {selectedNotification.data.companyName && (
                      <div className={`
                        p-3 rounded-lg 
                        ${isDark ? 'bg-blue-500/20 border-blue-500/30' : 'bg-blue-50 border-blue-200'} 
                        border
                      `}>
                        <span className={`font-medium ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                          🏢 Company: {selectedNotification.data.companyName}
                        </span>
                      </div>
                    )}
                    {selectedNotification.data.senderName && (
                      <div className={`
                        p-3 rounded-lg 
                        ${isDark ? 'bg-green-500/20 border-green-500/30' : 'bg-green-50 border-green-200'} 
                        border
                      `}>
                        <span className={`font-medium ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                          👤 From: {selectedNotification.data.senderName}
                        </span>
                      </div>
                    )}
                    {selectedNotification.data.applicationStatus && (
                      <div className={`
                        p-3 rounded-lg 
                        ${selectedNotification.data.applicationStatus === 'approved' 
                          ? (isDark ? 'bg-green-500/20 border-green-500/30' : 'bg-green-50 border-green-200')
                          : selectedNotification.data.applicationStatus === 'rejected'
                          ? (isDark ? 'bg-red-500/20 border-red-500/30' : 'bg-red-50 border-red-200')
                          : (isDark ? 'bg-yellow-500/20 border-yellow-500/30' : 'bg-yellow-50 border-yellow-200')
                        }
                        border
                      `}>
                        <span className={`font-medium ${
                          selectedNotification.data.applicationStatus === 'approved' 
                            ? (isDark ? 'text-green-300' : 'text-green-700')
                            : selectedNotification.data.applicationStatus === 'rejected'
                            ? (isDark ? 'text-red-300' : 'text-red-700')
                            : (isDark ? 'text-yellow-300' : 'text-yellow-700')
                        }`}>
                          📊 Status: {selectedNotification.data.applicationStatus.charAt(0).toUpperCase() + selectedNotification.data.applicationStatus.slice(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                {!selectedNotification.isRead && (
                  <button
                    onClick={() => {
                      markAsRead(selectedNotification._id);
                      closeNotificationModal();
                    }}
                    className={`
                      px-6 py-3 rounded-lg font-semibold transition-all duration-200
                      ${isDark 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-green-500 hover:bg-green-600 text-white'
                      }
                    `}
                  >
                    ✅ Mark as Read
                  </button>
                )}
                <button
                  onClick={() => {
                    deleteNotification(selectedNotification._id);
                    closeNotificationModal();
                  }}
                  className={`
                    px-6 py-3 rounded-lg font-semibold transition-all duration-200
                    ${isDark 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-red-500 hover:bg-red-600 text-white'
                    }
                  `}
                >
                  🗑️ Delete
                </button>
                <button
                  onClick={closeNotificationModal}
                  className={`
                    px-6 py-3 rounded-lg font-semibold transition-all duration-200
                    ${isDark 
                      ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                      : 'bg-gray-500 hover:bg-gray-600 text-white'
                    }
                  `}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </GradientBackground>
  );
}
