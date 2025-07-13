import React, { useState, useEffect } from "react";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState("");

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
          setLoading(false);
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
        return;
      }

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
      } finally {
        setLoading(false);
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
    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format username safely
  const formatUsername = (name) => {
    if (!name) return "";
    return name.toLowerCase().replace(/\s+/g, "-");
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

      <div className="max-w-md mx-auto">
        <div
          className="bg-white rounded-lg shadow-sm"
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

            <div className="space-y-3 mt-4">
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

        <div className="text-center mt-4 text-xs text-gray-400">
          Logged in as: {admin.name ? formatUsername(admin.name) : ""}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
