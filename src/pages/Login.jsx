import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "../providers/authContext";
import { toast } from "react-toastify";
import axios from "axios";

// Helper function to debug API response
const debugApiResponse = (response) => {
  console.log("API Response Type:", typeof response);
  console.log("API Response Structure:", response);

  if (Array.isArray(response)) {
    console.log("Response is an array with", response.length, "items");
  } else if (typeof response === "object") {
    console.log("Response keys:", Object.keys(response));
  }

  return response;
};

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const { signIn, signInWithGoogle } = React.useContext(AuthContext);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Verify admin credentials against the API
  const verifyAdminCredentials = async (email, password) => {
    try {
      console.log("Attempting admin login with:", { email });

      // Try direct admin email check first
      console.log(`Trying direct admin check for email: ${email}`);
      try {
        const directResponse = await axios.get(
          `https://vibe-hive-omega.vercel.app/admin/check/${email}`
        );
        console.log("Direct admin check response:", directResponse.data);

        if (directResponse.data && directResponse.data.isAdmin) {
          console.log("Direct admin check successful");
          // If this endpoint verifies the admin status, we can use it
          return {
            success: true,
            admin: {
              role: "admin",
              name: directResponse.data.name || "Admin User",
              email: email,
              photo:
                directResponse.data.photo ||
                "https://i.ibb.co/ZJP3sFZ/admin.png",
            },
          };
        }
      } catch (directErr) {
        console.log("Direct admin check failed:", directErr.message);
        // Continue with the general admin endpoint if direct check fails
      }

      // Try the general admin data endpoint
      const response = await axios.get(
        "https://vibe-hive-omega.vercel.app/admin"
      );

      const adminData = response.data;
      debugApiResponse(adminData);

      // Extra debugging to diagnose response issues
      console.log("Raw response:", JSON.stringify(response.data, null, 2));

      // Handle different response formats (array of admins or single admin object)
      if (Array.isArray(adminData)) {
        console.log("Checking admin credentials in array format");
        // Debug array contents
        adminData.forEach((admin, index) => {
          console.log(
            `Admin ${index}:`,
            admin.email ? admin.email : "No email property"
          );
        });

        // Find admin in array - case insensitive email comparison
        const admin = adminData.find(
          (admin) =>
            admin.email &&
            admin.email.toLowerCase() === email.toLowerCase() &&
            admin.password === password
        );

        if (admin) {
          console.log("Admin found in array");
          return {
            success: true,
            admin: {
              ...admin,
              role: "admin", // Ensure role is set to admin
            },
          };
        }
      } else if (adminData && typeof adminData === "object") {
        console.log("Checking admin credentials in object format");
        // Debug object properties
        console.log("Admin object keys:", Object.keys(adminData));

        // Direct object comparison - case insensitive email comparison
        if (
          adminData.email &&
          adminData.email.toLowerCase() === email.toLowerCase() &&
          adminData.password === password
        ) {
          console.log("Admin credentials matched");
          return {
            success: true,
            admin: {
              ...adminData,
              role: "admin", // Ensure role is set to admin
            },
          };
        }
      }

      // Special debugging for API response structure
      if (!Array.isArray(adminData) && typeof adminData === "object") {
        // Check if we need to look deeper in the response structure
        for (const key in adminData) {
          const value = adminData[key];
          console.log(`Checking property ${key}:`, typeof value);

          if (Array.isArray(value)) {
            console.log(`Found array in property ${key}, checking for admins`);
            const admin = value.find(
              (item) =>
                item.email &&
                item.email.toLowerCase() === email.toLowerCase() &&
                item.password === password
            );

            if (admin) {
              console.log("Admin found in nested array");
              return {
                success: true,
                admin: {
                  ...admin,
                  role: "admin", // Ensure role is set to admin
                },
              };
            }
          } else if (typeof value === "object" && value !== null) {
            console.log(`Checking nested object in property ${key}`);
            if (
              value.email &&
              value.email.toLowerCase() === email.toLowerCase() &&
              value.password === password
            ) {
              console.log("Admin credentials matched in nested object");
              return {
                success: true,
                admin: {
                  ...value,
                  role: "admin", // Ensure role is set to admin
                },
              };
            }
          }
        }
      }

      // Fallback: hardcoded admin credentials for development/testing
      if (
        email.toLowerCase() === "admin@example.com" &&
        password === "admin123"
      ) {
        console.log("Using hardcoded admin credentials (fallback)");
        return {
          success: true,
          admin: {
            role: "admin",
            name: "Admin User",
            email: email,
            photo: "https://i.ibb.co/ZJP3sFZ/admin.png", // Default admin photo
          },
        };
      }

      console.log("Admin verification failed: Invalid credentials");
      return {
        success: false,
        message: "Invalid admin credentials",
      };
    } catch (error) {
      console.error("Admin verification error:", error);
      console.error("Error details:", error.message);
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
      }

      // Try fallback admin credentials if API fails
      if (
        email.toLowerCase() === "admin@example.com" &&
        password === "admin123"
      ) {
        console.log("API failed, using hardcoded admin credentials");
        return {
          success: true,
          admin: {
            role: "admin",
            name: "Admin User",
            email: email,
            photo: "https://i.ibb.co/ZJP3sFZ/admin.png", // Default admin photo
          },
        };
      }

      throw new Error(
        error.response?.data?.message || "Admin verification failed"
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({}); // Clear previous errors

    const newErrors = {};

    // Validation
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const { email, password } = formData;

      if (isAdminMode) {
        // Admin authentication flow
        console.log("Attempting admin login with:", { email });

        try {
          // First try the hardcoded admin credentials for quick development access
          if (
            email.toLowerCase() === "admin@example.com" &&
            password === "admin123"
          ) {
            console.log("Using hardcoded admin credentials");

            const adminInfo = {
              role: "admin",
              name: "Admin User",
              email: email,
              photo: "https://i.ibb.co/ZJP3sFZ/admin.png",
            };

            // Store admin session info
            localStorage.setItem("adminEmail", email);
            localStorage.setItem("adminInfo", JSON.stringify(adminInfo));

            toast.success("Admin login successful (development mode)");

            console.log("Redirecting to admin dashboard...");
            // Redirect to admin dashboard
            setTimeout(() => {
              window.location.href = "/admin/profile";
            }, 1000);

            // Set loading to false to prevent further processing
            setLoading(false);
            return;
          }

          // Try API admin verification
          console.log("Checking API for admin credentials");
          const adminData = await verifyAdminCredentials(email, password);
          console.log("Admin verification result:", {
            success: adminData.success,
          });

          if (adminData.success) {
            console.log(
              "Admin login successful, storing admin data:",
              adminData.admin
            );

            if (!adminData.admin) {
              throw new Error("Admin data is missing in the response");
            }

            // Ensure the admin data has all required fields
            const completeAdminData = {
              role: "admin",
              name: adminData.admin.name || "Admin User",
              email: adminData.admin.email || email,
              photo:
                adminData.admin.photo || "https://i.ibb.co/ZJP3sFZ/admin.png",
              ...adminData.admin,
            };

            // Store admin session info
            localStorage.setItem("adminEmail", email);
            localStorage.setItem(
              "adminInfo",
              JSON.stringify(completeAdminData)
            );

            toast.success("Admin login successful");

            console.log("Admin data stored, redirecting to dashboard");
            // Use direct navigation to ensure the route is hit correctly
            setTimeout(() => {
              // Force a full page refresh to ensure the AuthProvider picks up the admin status
              window.location.href = "/admin/profile";
            }, 1000);
            toast.success("Redirecting to admin dashboard...");
          } else {
            console.error("Admin verification failed:", adminData);
            throw new Error(adminData.message || "Invalid admin credentials");
          }
        } catch (err) {
          console.error("Error during admin authentication:", err);
          throw new Error(err.message || "Admin login failed");
        }
      } else {
        // Regular user authentication via Firebase
        await signIn(email, password);
        toast.success("Login Successful");
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);

      // Handle specific errors
      let errorMessage = "Login failed. Please try again.";

      if (isAdminMode) {
        errorMessage = error.message || "Invalid admin credentials";
        console.error("Admin login error details:", error);
      } else {
        // Firebase error handling
        if (error.code === "auth/user-not-found") {
          errorMessage = "No account found with this email address.";
        } else if (error.code === "auth/wrong-password") {
          errorMessage = "Incorrect password. Please try again.";
        } else if (error.code === "auth/invalid-email") {
          errorMessage = "Please enter a valid email address.";
        } else if (error.code === "auth/too-many-requests") {
          errorMessage = "Too many failed attempts. Please try again later.";
        } else if (error.message) {
          errorMessage = error.message;
        }
      }

      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    // Block Google sign-in for admin mode
    if (isAdminMode) {
      toast.error("Google sign-in is not available for admin accounts");
      return;
    }

    try {
      setLoading(true);
      await signInWithGoogle();
      toast.success("Google sign-in successful!");
      navigate("/");
    } catch (error) {
      console.error("Google sign-in error:", error);

      let errorMessage = "Google sign-in failed. Please try again.";

      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Sign-in cancelled. Please try again.";
      } else if (error.code === "auth/popup-blocked") {
        errorMessage = "Popup blocked. Please allow popups and try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-indigo-400 to-indigo-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full -translate-y-16 translate-x-16 opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-400 to-orange-400 rounded-full translate-y-12 -translate-x-12 opacity-20"></div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-6">
            <button className="text-gray-400 hover:text-gray-600">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <span className="text-sm text-gray-500">
              New member?{" "}
              <Link
                to="/register"
                className="text-blue-500 hover:text-blue-600 font-medium"
              >
                Sign up
              </Link>
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isAdminMode ? "Admin Login" : "Welcome Back"}
          </h1>
          <p className="text-gray-500">
            {isAdminMode
              ? "Sign in to your admin dashboard"
              : "Sign in to your account"}
          </p>
        </div>

        {/* User/Admin Toggle */}
        <div className="mb-6">
          <div className="flex items-center justify-center p-1 bg-gray-100 rounded-xl">
            <button
              type="button"
              onClick={() => setIsAdminMode(false)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                !isAdminMode
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center justify-center cursor-pointer">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                User
              </div>
            </button>
            <button
              type="button"
              onClick={() => setIsAdminMode(true)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                isAdminMode
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center justify-center cursor-pointer">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                Admin
              </div>
            </button>
          </div>

          {isAdminMode && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start">
                <svg
                  className="w-4 h-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <div className="text-sm text-amber-700">
                  <p className="font-medium mb-1">Admin Access</p>
                  <p>
                    You're signing in as an administrator. Only authorized
                    personnel should access this area.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="relative">
            <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-500 transition-colors">
              <svg
                className="w-5 h-5 text-gray-400 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 12a4 4 0 10-8 0 4 4 0 018 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={
                  isAdminMode ? "admin@example.com" : "your.email@example.com"
                }
                className="flex-1 outline-none text-gray-700 placeholder-gray-400"
              />
              {formData.email && (
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="relative">
            <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-500 transition-colors">
              <svg
                className="w-5 h-5 text-gray-400 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="flex-1 outline-none text-gray-700 placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 ml-2"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full font-semibold py-3 px-6 cursor-pointer rounded-xl transition-colors flex items-center justify-center disabled:opacity-50 ${
              isAdminMode
                ? "bg-amber-500 hover:bg-amber-600 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : null}
            {isAdminMode ? "Admin Sign In" : "Sign In"}
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">OR</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="flex space-x-4">
            <button
              type="button"
              className={`flex-1 border border-gray-200 rounded-xl py-3 px-4 flex items-center justify-center transition-colors ${
                isAdminMode
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-50 cursor-pointer"
              }`}
              disabled={isAdminMode}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#1877F2"
                  d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isAdminMode}
              className={`flex-1 border border-gray-200 rounded-xl py-3 px-4 flex items-center justify-center transition-colors ${
                isAdminMode
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-50 cursor-pointer"
              }`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </button>
          </div>

          {errors.general && (
            <p className="text-red-500 text-sm text-center mt-4">
              {errors.general}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
