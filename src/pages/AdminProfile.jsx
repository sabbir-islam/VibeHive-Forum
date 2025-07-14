import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalComments: 0,
    totalUsers: 0,
    totalTags: 0,
  });
  const [newTag, setNewTag] = useState("");
  const [tags, setTags] = useState([]);
  const [loadingTags, setLoadingTags] = useState(true);

  useEffect(() => {
    // First try to get admin data from localStorage
    const getAdminFromLocalStorage = () => {
      try {
        const adminInfo = localStorage.getItem("adminInfo");
        const adminEmail = localStorage.getItem("adminEmail");

        if (adminInfo && adminEmail) {
          const adminData = JSON.parse(adminInfo);
          // Ensure the admin data has the correct structure
          const validatedAdminData = {
            ...adminData,
            role: "admin", // Ensure role is always set
            email: adminEmail,
            // Add any missing required fields
            name: adminData.name || "Admin User",
            photo: adminData.photo || "https://i.ibb.co/ZJP3sFZ/admin.png",
          };

          console.log(
            "AdminProfile: Found admin data in localStorage",
            validatedAdminData
          );
          setAdmin(validatedAdminData);
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error retrieving admin from localStorage:", error);
        return false;
      }
    };

    // Fetch admin data from API if not in localStorage
    const fetchAdminData = async () => {
      // First check localStorage
      if (getAdminFromLocalStorage()) {
        // Continue to fetch stats even if admin data is in localStorage
      } else {
        try {
          const adminEmail = localStorage.getItem("adminEmail");
          if (!adminEmail) {
            throw new Error("No admin email found");
          }

          console.log("AdminProfile: Fetching admin data for", adminEmail);
          const response = await fetch(
            `https://vibe-hive-omega.vercel.app/admin/check/${adminEmail}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch admin data");
          }
          const data = await response.json();
          setAdmin(data);

          // Save to localStorage for future use
          localStorage.setItem("adminInfo", JSON.stringify(data));
        } catch (err) {
          setError(err.message);
          console.error("Error fetching admin data:", err);
        }
      }

      // Now fetch site statistics using the forum-stats endpoint
      try {
        // Fetch all statistics in a single API call
        const statsResponse = await axios.get(
          "https://vibe-hive-omega.vercel.app/forum-stats"
        );

        console.log("Stats API response:", statsResponse.data);

        // Set stats from the API response
        if (statsResponse.data) {
          setStats({
            totalPosts: statsResponse.data.forumCount || 0,
            totalUsers: statsResponse.data.userCount || 0,
            totalComments: statsResponse.data.replyCount || 0,
            totalTags: statsResponse.data.tagCount || 0,
            totalTopics: statsResponse.data.topicCount || 0,
          });
        }
      } catch (err) {
        console.error("Error fetching site statistics:", err);
        // Don't set error state here, we want to show admin profile even if stats fail
      } finally {
        setLoading(false);
      }
    };

    // Fetch available tags
    const fetchTags = async () => {
      try {
        const response = await axios.get(
          "https://vibe-hive-omega.vercel.app/tags"
        );
        const fetchedTags = Array.isArray(response.data) ? response.data : [];
        setTags(fetchedTags);

        // We won't update stats.totalTags here as it's already provided by forum-stats API
      } catch (err) {
        console.error("Error fetching tags:", err);
      } finally {
        setLoadingTags(false);
      }
    };

    // Set current date time in YYYY-MM-DD HH:MM:SS format
    const updateDateTime = () => {
      const now = new Date();
      const year = now.getUTCFullYear();
      const month = String(now.getUTCMonth() + 1).padStart(2, "0");
      const day = String(now.getUTCDate()).padStart(2, "0");
      const hours = String(now.getUTCHours()).padStart(2, "0");
      const minutes = String(now.getUTCMinutes()).padStart(2, "0");
      const seconds = String(now.getUTCSeconds()).padStart(2, "0");

      const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      setCurrentDateTime(formattedDate);
    };

    fetchAdminData();
    fetchTags();
    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handler for adding a new tag
  const handleAddTag = async (e) => {
    e.preventDefault();

    if (!newTag.trim()) {
      toast.error("Tag name cannot be empty");
      return;
    }

    try {
      const response = await axios.post(
        "https://vibe-hive-omega.vercel.app/tags",
        {
          name: newTag.trim(),
        }
      );

      if (response.data) {
        setTags([...tags, response.data]);
        setNewTag("");

        // Increment tag count in stats
        setStats((prevStats) => ({
          ...prevStats,
          totalTags: (prevStats.totalTags || 0) + 1,
        }));

        toast.success("Tag added successfully");
      }
    } catch (err) {
      console.error("Error adding tag:", err);
      toast.error(err.response?.data?.message || "Failed to add tag");
    }
  };

  // Handler for deleting a tag
  const handleDeleteTag = async (tagId) => {
    try {
      await axios.delete(`https://vibe-hive-omega.vercel.app/tags/${tagId}`);
      setTags(tags.filter((tag) => tag._id !== tagId));

      // Decrement tag count in stats
      setStats((prevStats) => ({
        ...prevStats,
        totalTags: Math.max(0, (prevStats.totalTags || 0) - 1),
      }));

      toast.success("Tag deleted successfully");
    } catch (err) {
      console.error("Error deleting tag:", err);
      toast.error(err.response?.data?.message || "Failed to delete tag");
    }
  };

  // Format username safely
  const formatUsername = (name) => {
    if (!name) return "";
    return name.toLowerCase().replace(/\s+/g, "-");
  };

  // Colors for the pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  // Prepare data for the pie chart
  const prepareChartData = () => {
    return [
      { name: "Forums", value: stats.totalPosts },
      { name: "Replies", value: stats.totalComments },
      { name: "Users", value: stats.totalUsers },
      { name: "Topics", value: stats.totalTopics || 0 },
    ];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span
          className="loading loading-spinner loading-lg"
          style={{ color: "#3B82DE" }}
        ></span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="alert max-w-md mx-auto mt-10"
        style={{
          backgroundColor: "#f8d7da",
          color: "#721c24",
          border: "1px solid #f5c6cb",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{error}</span>
      </div>
    );
  }

  if (!admin) {
    return (
      <div
        className="alert max-w-md mx-auto mt-10"
        style={{
          backgroundColor: "#fff3cd",
          color: "#856404",
          border: "1px solid #ffeeba",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span>No admin data found</span>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <div className="text-center mb-5 text-sm text-gray-500">
        Current Date and Time (UTC): {currentDateTime}
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Admin Profile Card */}
        <div
          className="bg-white rounded-lg shadow-sm mb-8"
          style={{ border: "1px solid #e9ecef" }}
        >
          {/* Card header with primary color */}
          <div
            className="relative h-32 rounded-t-lg"
            style={{ backgroundColor: "#3B82DE" }}
          >
            <div className="absolute -bottom-12 inset-x-0 flex justify-center">
              <div className="w-24 h-24 rounded-full ring-2 ring-white overflow-hidden bg-white">
                <img
                  src={admin.photo || "https://i.ibb.co/ZJP3sFZ/admin.png"}
                  alt={admin.name || "Admin"}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <div
                className="px-3 py-1 rounded-full text-xs text-white"
                style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
              >
                {admin.role || "Admin"}
              </div>
            </div>
          </div>

          {/* Card body */}
          <div className="pt-16 px-6 pb-6">
            <h2 className="text-center text-xl font-semibold text-gray-800 mb-4">
              {admin.name || "Admin User"}
            </h2>

            <div className="border-t border-gray-100 my-3"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 p-2 rounded-md bg-gray-50">
                  <span className="font-medium text-gray-600">Email:</span>
                  <span className="break-all text-gray-800">{admin.email}</span>
                </div>

                {admin._id && (
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 p-2 rounded-md bg-gray-50">
                    <span className="font-medium text-gray-600">ID:</span>
                    <span className="break-all text-xs text-gray-500">
                      {admin._id}
                    </span>
                  </div>
                )}

                {/* Site Statistics */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 p-2 rounded-md bg-gray-50">
                  <span className="font-medium text-gray-600">
                    Total Forums:
                  </span>
                  <span className="text-gray-800 font-semibold">
                    {stats.totalPosts}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 p-2 rounded-md bg-gray-50">
                  <span className="font-medium text-gray-600">
                    Total Replies:
                  </span>
                  <span className="text-gray-800 font-semibold">
                    {stats.totalComments}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 p-2 rounded-md bg-gray-50">
                  <span className="font-medium text-gray-600">
                    Total Users:
                  </span>
                  <span className="text-gray-800 font-semibold">
                    {stats.totalUsers}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 p-2 rounded-md bg-gray-50">
                  <span className="font-medium text-gray-600">
                    Total Topics:
                  </span>
                  <span className="text-gray-800 font-semibold">
                    {stats.totalTopics || 0}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 p-2 rounded-md bg-gray-50">
                  <span className="font-medium text-gray-600">Total Tags:</span>
                  <span className="text-gray-800 font-semibold">
                    {stats.totalTags}
                  </span>
                </div>
              </div>

              {/* Pie Chart */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-center text-lg font-medium mb-4">
                  Site Statistics
                </h3>
                <div style={{ width: "100%", height: 250 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={prepareChartData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        animationDuration={1000}
                        animationBegin={0}
                      >
                        {prepareChartData().map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [
                          `${value}`,
                          `Total ${name}`,
                        ]}
                        contentStyle={{
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                  {COLORS.map((color, index) => {
                    const data = prepareChartData()[index];
                    return (
                      <div
                        key={`stat-${index}`}
                        className="p-2 rounded-md"
                        style={{ backgroundColor: `${color}20` }}
                      >
                        <div className="text-lg font-bold" style={{ color }}>
                          {data.value}
                        </div>
                        <div className="text-xs text-gray-600">{data.name}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                className="w-full py-2 px-4 rounded-md font-medium text-white transition-colors"
                style={{ backgroundColor: "#3B82DE" }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#2563eb")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#3B82DE")}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Tag Management Section */}
        <div
          className="bg-white rounded-lg shadow-sm p-6"
          style={{ border: "1px solid #e9ecef" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold">Tag Management</h3>
              <p className="text-gray-600 text-sm mt-1">
                Add tags for forum posts categorization
              </p>
            </div>
            <div className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
              {tags.length} Tags Available
            </div>
          </div>

          {/* Add Tag Form */}
          <form onSubmit={handleAddTag} className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Enter new tag"
                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={20}
              />
              <button
                type="submit"
                disabled={!newTag.trim()}
                className={`py-2 px-4 rounded-md text-white transition-colors ${
                  newTag.trim()
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Add Tag
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Tags should be short and descriptive (max 20 characters)
            </div>
          </form>

          {/* Tags List */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-medium mb-3">Available Tags</h4>
            {loadingTags ? (
              <div className="text-center py-4">
                <span
                  className="loading loading-spinner loading-md"
                  style={{ color: "#3B82DE" }}
                ></span>
              </div>
            ) : tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <div
                    key={tag._id}
                    className="flex items-center bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1 transition-colors"
                  >
                    <span className="text-sm text-gray-800 mr-1">
                      {tag.name}
                    </span>
                    <button
                      onClick={() => handleDeleteTag(tag._id)}
                      className="text-gray-500 hover:text-red-500 focus:outline-none transition-colors"
                      title="Delete tag"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 mx-auto text-gray-400 mb-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                <p className="text-gray-500">No tags available yet</p>
                <p className="text-gray-400 text-sm mt-1">
                  Add your first tag using the form above
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-4 text-xs text-gray-400">
          Logged in as: {admin.name ? formatUsername(admin.name) : ""}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
