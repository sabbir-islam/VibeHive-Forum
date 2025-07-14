import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { NotificationContext } from "./notificationContext";

const NotificationProvider = ({ children }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastCheckedTime, setLastCheckedTime] = useState(() => {
    const saved = localStorage.getItem("lastCheckedAnnouncementTime");
    return saved ? new Date(saved).getTime() : new Date().getTime();
  });

  // Fetch announcements with useCallback to avoid infinite re-renders
  const fetchAnnouncements = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://vibe-hive-omega.vercel.app/announcements"
      );

      let fetchedAnnouncements = [];

      // Handle the API response structure
      if (
        response.data &&
        typeof response.data === "object" &&
        response.data._id
      ) {
        fetchedAnnouncements = [response.data];
      } else if (Array.isArray(response.data)) {
        fetchedAnnouncements = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        fetchedAnnouncements = response.data.data;
      }

      setAnnouncements(fetchedAnnouncements);

      // Calculate unread count
      const count = fetchedAnnouncements.filter(
        (announcement) =>
          new Date(announcement.createdAt).getTime() > lastCheckedTime
      ).length;

      setUnreadCount(count);
    } catch (error) {
      console.error("Error fetching announcements for notifications:", error);
    }
  }, [lastCheckedTime]);

  // Mark all as read
  const markAllAsRead = () => {
    const now = new Date().getTime();
    setLastCheckedTime(now);
    localStorage.setItem("lastCheckedAnnouncementTime", now);
    setUnreadCount(0);
  };

  // Initial fetch and setup polling
  useEffect(() => {
    fetchAnnouncements();

    // Poll for new announcements every minute
    const interval = setInterval(fetchAnnouncements, 60000);

    return () => clearInterval(interval);
  }, [fetchAnnouncements]); // Add fetchAnnouncements as dependency

  return (
    <NotificationContext.Provider
      value={{
        announcements,
        unreadCount,
        markAllAsRead,
        fetchAnnouncements,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
