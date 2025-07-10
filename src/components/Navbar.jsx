import React, { useState, useRef, useEffect, use } from "react";
import { Link, NavLink } from "react-router";
import { AuthContext } from "../providers/authContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get auth context
  const { currentUser, logout } = use(AuthContext);
  const isLoggedIn = !!currentUser;

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  // Get user display name and first letter for avatar
  const getUserDisplayName = () => {
    if (!currentUser) return "";
    return (
      currentUser.displayName || currentUser.email?.split("@")[0] || "User"
    );
  };

  const getUserInitial = () => {
    const displayName = getUserDisplayName();
    return displayName.charAt(0).toUpperCase();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Custom active link styling
  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
      isActive
        ? "bg-blue-100 text-blue-700 border-b-2 border-blue-600"
        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
    }`;

  const dropdownLinkClass = ({ isActive }) =>
    `flex items-center px-4 py-2 transition-colors duration-200 ${
      isActive
        ? "bg-blue-100 text-blue-700 border-r-4 border-blue-600"
        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
      isActive
        ? "bg-blue-100 text-blue-700 border-l-4 border-blue-600"
        : "text-gray-700 hover:text-blue-600 hover:bg-white"
    }`;

  const mobileDropdownLinkClass = ({ isActive }) =>
    `block px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      isActive
        ? "bg-blue-100 text-blue-700 border-l-4 border-blue-600"
        : "text-gray-700 hover:text-blue-600 hover:bg-white"
    }`;

  return (
    <div>
      <nav className="w-80% mx-auto bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Website Name */}
            <Link to={"/"}>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-lg mr-3 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">V</span>
                  </div>
                </div>
                <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-700 bg-clip-text text-transparent">
                  VIBEHIVE
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <NavLink to="/" className={navLinkClass}>
                  Home
                </NavLink>
                <NavLink to="/membership" className={navLinkClass}>
                  Membership
                </NavLink>

                {/* User Dashboard Dropdown */}
                {isLoggedIn && (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={toggleDropdown}
                      className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                        isDropdownOpen
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                      }`}
                    >
                      User Dashboard
                      <svg
                        className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <NavLink
                          to={`/profile/${currentUser.email}`}
                          className={dropdownLinkClass}
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <svg
                            className="w-4 h-4 mr-3"
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
                          My Profile
                        </NavLink>
                        <NavLink
                          to="/add-post"
                          className={dropdownLinkClass}
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <svg
                            className="w-4 h-4 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                          Add Post
                        </NavLink>
                        <NavLink
                          to="/my-posts"
                          className={dropdownLinkClass}
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <svg
                            className="w-4 h-4 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          My Posts
                        </NavLink>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right side - Notification and Join Us/User Info */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Notification Icon */}
              <button className="p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors duration-200 relative">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-3.394-3.394A10 10 0 0121 10.5c0-5.243-4.243-9.5-9.5-9.5S2 5.257 2 10.5a10 10 0 00.394 3.394L2 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {/* Notification badge */}
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
              </button>

              {/* Join Us Button (when not logged in) or User Info (when logged in) */}
              {!isLoggedIn ? (
                <Link to={"/register"}>
                  <button className="bg-[#3B82DE] hover:bg-slate-900 cursor-pointer text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md">
                    Join Us
                  </button>
                </Link>
              ) : (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {currentUser.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full object-cover border-2 border-blue-500"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {getUserInitial()}
                        </span>
                      </div>
                    )}
                    <span className="text-gray-700 font-medium">
                      {getUserDisplayName()}
                    </span>
                    {/* Online status indicator */}
                    <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-gray-500 hover:bg-gray-600 cursor-pointer text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isMenuOpen ? (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 rounded-lg mt-2">
                <NavLink
                  to="/"
                  className={mobileLinkClass}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </NavLink>
                <NavLink
                  to="/membership"
                  className={mobileLinkClass}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Membership
                </NavLink>

                {/* Mobile User Dashboard Menu */}
                {isLoggedIn && (
                  <>
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="px-3 py-2 text-sm font-semibold text-gray-500">
                        User Dashboard
                      </div>
                      <NavLink
                        to={`/profile/:${currentUser.email}`}
                        className={mobileDropdownLinkClass}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Profile
                      </NavLink>
                      <NavLink
                        to="/add-post"
                        className={mobileDropdownLinkClass}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Add Post
                      </NavLink>
                      <NavLink
                        to="/my-posts"
                        className={mobileDropdownLinkClass}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Posts
                      </NavLink>
                    </div>
                  </>
                )}

                {/* Mobile Notification and Join Us/User Info */}
                <div className="flex items-center justify-between px-3 py-2 border-t border-gray-200 mt-2 pt-2">
                  <button className="p-2 text-gray-700 hover:text-blue-600 hover:bg-white rounded-full transition-colors duration-200 relative">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-3.394-3.394A10 10 0 0121 10.5c0-5.243-4.243-9.5-9.5-9.5S2 5.257 2 10.5a10 10 0 00.394 3.394L2 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
                  </button>

                  {!isLoggedIn ? (
                    <Link to={"/register"}>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md">
                        Join Us
                      </button>
                    </Link>
                  ) : (
                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex items-center space-x-2">
                        {currentUser.photoURL ? (
                          <img
                            src={currentUser.photoURL}
                            alt="User Avatar"
                            className="w-6 h-6 rounded-full object-cover border border-blue-500"
                          />
                        ) : (
                          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-xs">
                              {getUserInitial()}
                            </span>
                          </div>
                        )}
                        <span className="text-sm text-gray-600">
                          {getUserDisplayName()}
                        </span>
                        <div className="w-2 h-2 bg-green-500 rounded-full border border-white shadow-sm"></div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded text-sm font-medium transition-colors duration-200"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
