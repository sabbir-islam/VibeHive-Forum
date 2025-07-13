import React, { useEffect, useState, useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../providers/authContext";

const AdminGuard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const verifyAdminStatus = async () => {
      try {
        console.log("AdminGuard: Verifying admin status");

        // First check if we already have admin info in currentUser
        if (currentUser?.role === "admin") {
          console.log("AdminGuard: User is admin based on currentUser");
          setIsAdmin(true);
          setLoading(false);
          return;
        }

        // Get admin email from localStorage
        const adminEmail = localStorage.getItem("adminEmail");
        const adminInfo = localStorage.getItem("adminInfo");

        console.log("AdminGuard: Admin email from localStorage:", adminEmail);
        console.log("AdminGuard: Admin info exists:", !!adminInfo);

        if (!adminEmail) {
          console.log("AdminGuard: No admin email found");
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        // Check if we have valid admin info in localStorage
        if (adminInfo) {
          try {
            const parsedInfo = JSON.parse(adminInfo);
            if (parsedInfo && parsedInfo.role === "admin") {
              console.log("AdminGuard: Admin info found in localStorage");
              setIsAdmin(true);
              setLoading(false);
              return;
            }
          } catch (e) {
            console.error("AdminGuard: Error parsing admin info:", e);
          }
        }

        // If we're here, try verifying with backend as fallback
        try {
          console.log("AdminGuard: Verifying with backend");
          const response = await axios.get(
            `https://vibe-hive-omega.vercel.app/admin/check/${adminEmail}`
          );
          console.log(
            "AdminGuard: Backend verification response:",
            response.data
          );

          if (response.data.isAdmin) {
            console.log("AdminGuard: Admin verified by backend");
            setIsAdmin(true);
          } else {
            console.log("AdminGuard: Not an admin according to backend");
            // Clear invalid admin data
            localStorage.removeItem("adminEmail");
            localStorage.removeItem("adminInfo");
            setIsAdmin(false);
          }
        } catch (apiError) {
          console.error("AdminGuard: API error:", apiError);

          // If API fails, check for hardcoded admin credentials
          if (adminEmail.toLowerCase() === "admin@example.com") {
            console.log("AdminGuard: Using hardcoded admin credentials");
            setIsAdmin(true);
            setLoading(false);
            return;
          }

          throw apiError;
        }
      } catch (error) {
        console.error("AdminGuard: Error verifying admin status:", error);
        toast.error("Error verifying admin permissions");
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAdminStatus();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <Navigate
        to="/login"
        state={{ from: location, adminRequired: true }}
        replace
      />
    );
  }

  return <Outlet />;
};

export default AdminGuard;
