import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../providers/authContext";
import { useNotifications } from "../contexts/notificationContext";
import { toast } from "react-toastify";

const Announcement = () => {
  const { currentUser } = useContext(AuthContext);
  const { fetchAnnouncements } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    authorName: currentUser?.displayName || "",
    authorEmail: currentUser?.email || "",
    authorImage: currentUser?.photoURL || "",
  });

  useEffect(() => {
    // Check if user is admin
    const verifyAdminStatus = async () => {
      try {
        if (currentUser?.role === "admin") {
          setIsAdmin(true);
          return;
        }

        const adminEmail = localStorage.getItem("adminEmail");
        if (adminEmail === currentUser?.email) {
          setIsAdmin(true);
          return;
        }

        // Verify with backend if needed
        const response = await axios.get(
          `https://vibe-hive-omega.vercel.app/users/${currentUser?.email}`
        );

        if (response.data?.role === "admin") {
          setIsAdmin(true);
          localStorage.setItem("adminEmail", currentUser?.email);
        }
      } catch (error) {
        console.error("Error verifying admin status:", error);
        setIsAdmin(false);
      }
    };

    if (currentUser?.email) {
      verifyAdminStatus();
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAdmin) {
      toast.error("Only admins can post announcements");
      return;
    }

    if (!formData.title || !formData.description) {
      toast.error("Title and description are required");
      return;
    }

    try {
      setLoading(true);

      const announcementData = {
        ...formData,
        createdAt: new Date().toISOString(),
      };

      await axios.post(
        "https://vibe-hive-omega.vercel.app/announcements",
        announcementData
      );

      toast.success("Announcement posted successfully!");

      // Refresh notifications after posting a new announcement
      fetchAnnouncements();
      setFormData({
        ...formData,
        title: "",
        description: "",
      });

      // Optionally navigate to a page showing all announcements
      // navigate('/announcements-list');
    } catch (error) {
      console.error("Error posting announcement:", error);
      toast.error("Failed to post announcement. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-xl text-red-500">
          Please log in to access this page
        </p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-xl text-red-500">Only admins can access this page</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold text-center mb-8">
        Post an Announcement
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-6"
      >
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Announcement Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter announcement title"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="description"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Announcement Content
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="6"
            placeholder="Enter announcement content"
          ></textarea>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            {loading ? "Posting..." : "Post Announcement"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Announcement;
