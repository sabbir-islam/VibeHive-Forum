import React, { useState } from "react";
import { useNotifications } from "../contexts/notificationContext";
import { IoNotificationsOutline } from "react-icons/io5";

const NavbarNotification = () => {
  const { announcements, unreadCount, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      markAllAsRead();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none"
      >
        <IoNotificationsOutline className="text-xl" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 w-80 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="p-3 border-b">
            <h3 className="text-lg font-medium">Announcements</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {announcements.length > 0 ? (
              announcements.map((announcement) => (
                <div
                  key={announcement._id}
                  className="p-3 border-b hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">
                      {announcement.title}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {formatDate(announcement.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {announcement.description}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No announcements
              </div>
            )}
          </div>
          {announcements.length > 0 && (
            <div className="p-2 border-t text-center">
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NavbarNotification;
