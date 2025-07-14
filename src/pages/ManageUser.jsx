import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingUser, setProcessingUser] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const userPerPageOptions = [5, 10, 20];

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://vibe-hive-omega.vercel.app/users");

      if (!response.ok) {
        throw new Error("Failed to fetch users data");
      }

      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to make a user an admin
  const makeAdmin = async (userId, currentRole) => {
    // Don't do anything if user is already an admin
    if (currentRole === "admin") {
      toast.info("User is already an admin");
      return;
    }

    try {
      setProcessingUser(userId);

      const response = await fetch(
        `https://vibe-hive-omega.vercel.app/users/make-admin/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user role");
      }

      // Update users list to reflect the change
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, role: "admin" } : user
        )
      );

      // Reset to first page to help user find the updated user
      setCurrentPage(1);

      toast.success("User role updated successfully");
    } catch (err) {
      console.error("Error updating user role:", err);
      toast.error(err.message || "Failed to update user role");
    } finally {
      setProcessingUser(null);
    }
  };

  // Function to determine the membership badge color
  const getMembershipBadgeColor = (plan) => {
    switch (plan?.toLowerCase()) {
      case "bronze":
        return "bg-amber-600 text-white";
      case "gold":
        return "bg-yellow-400 text-black";
      case "platinum":
        return "bg-gray-300 text-black";
      case "diamond":
        return "bg-blue-500 text-white";
      case "premium":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Calculate pagination values here
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Change page function
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle changing the number of users per page
  const handleUsersPerPageChange = (e) => {
    const newUsersPerPage = parseInt(e.target.value);
    setUsersPerPage(newUsersPerPage);
    // Reset to first page when changing the number of users per page
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span
          className="loading loading-spinner loading-lg"
          style={{ color: "#3B82DE" }}
        ></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div
            className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={fetchUsers}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            User Management
          </h1>
          <button
            onClick={fetchUsers}
            className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-500 text-white text-sm sm:text-base rounded hover:bg-blue-600 transition-colors"
            style={{ backgroundColor: "#3B82DE" }}
          >
            Refresh
          </button>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    User Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Membership
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={
                                user.photo ||
                                "https://i.ibb.co/ZJP3sFZ/default-user.png"
                              }
                              alt={user.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === "admin"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.role || "user"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="group relative">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getMembershipBadgeColor(
                              user.membership?.plan
                            )}`}
                          >
                            {user.membership?.isActive && user.membership?.plan
                              ? `${
                                  user.membership.plan.charAt(0).toUpperCase() +
                                  user.membership.plan.slice(1)
                                }`
                              : "Free"}
                          </span>

                          {user.membership && (
                            <>
                              <div className="text-xs text-gray-500 mt-1">
                                {user.membership.expireDate &&
                                  `Expires: ${new Date(
                                    user.membership.expireDate
                                  ).toLocaleDateString()}`}
                              </div>

                              {/* Tooltip with more membership details */}
                              <div className="absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 right-0 bottom-full mb-2 w-48">
                                <p>
                                  <strong>Plan:</strong>{" "}
                                  {user.membership.plan || "None"}
                                </p>
                                <p>
                                  <strong>Status:</strong>{" "}
                                  {user.membership.isActive
                                    ? "Active"
                                    : "Inactive"}
                                </p>
                                {user.membership.startDate && (
                                  <p>
                                    <strong>Started:</strong>{" "}
                                    {new Date(
                                      user.membership.startDate
                                    ).toLocaleDateString()}
                                  </p>
                                )}
                                {user.membership.expireDate && (
                                  <p>
                                    <strong>Expires:</strong>{" "}
                                    {new Date(
                                      user.membership.expireDate
                                    ).toLocaleDateString()}
                                  </p>
                                )}
                                {/* Arrow */}
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => makeAdmin(user._id, user.role)}
                          disabled={
                            user.role === "admin" || processingUser === user._id
                          }
                          className={`px-3 py-1 text-xs rounded-md ${
                            user.role === "admin"
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : processingUser === user._id
                              ? "bg-gray-300 text-gray-600 cursor-wait"
                              : "bg-blue-500 text-white hover:bg-blue-600"
                          }`}
                          style={
                            user.role !== "admin" && processingUser !== user._id
                              ? { backgroundColor: "#3B82DE" }
                              : {}
                          }
                        >
                          {processingUser === user._id ? (
                            <span className="inline-flex items-center">
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Processing
                            </span>
                          ) : user.role === "admin" ? (
                            "Admin"
                          ) : (
                            "Make Admin"
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      {users.length > 0
                        ? "No users found on this page"
                        : "No users found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500 flex items-center">
            {users.length > 0 ? (
              <>
                <span className="mr-4">
                  Showing{" "}
                  <span className="font-medium text-gray-700">
                    {indexOfFirstUser + 1} -{" "}
                    {indexOfLastUser > users.length
                      ? users.length
                      : indexOfLastUser}{" "}
                  </span>
                  of{" "}
                  <span className="font-medium text-gray-700">
                    {users.length}
                  </span>{" "}
                  users
                </span>

                <div className="flex items-center">
                  <label htmlFor="usersPerPage" className="mr-2">
                    Show:
                  </label>
                  <select
                    id="usersPerPage"
                    value={usersPerPage}
                    onChange={handleUsersPerPageChange}
                    className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {userPerPageOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              "No users to display"
            )}
          </div>

          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => {
                  if (currentPage > 1) {
                    paginate(currentPage - 1);
                  }
                }}
                disabled={currentPage === 1 || users.length === 0}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                  currentPage === 1 || users.length === 0
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }`}
                style={
                  currentPage !== 1 && users.length > 0
                    ? { backgroundColor: "#EFF6FF" }
                    : {}
                }
              >
                <span className="sr-only">Previous</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Show limited page numbers with ellipsis for better UX */}
              {Array.from(
                { length: Math.ceil(users.length / usersPerPage) },
                (_, i) => i + 1
              ).map((pageNumber) => {
                // Show current page and 1 page before and after
                const pageNumbersToShow = [
                  1,
                  Math.ceil(users.length / usersPerPage),
                ];
                if (currentPage > 1) pageNumbersToShow.push(currentPage - 1);
                if (currentPage < Math.ceil(users.length / usersPerPage))
                  pageNumbersToShow.push(currentPage + 1);
                pageNumbersToShow.push(currentPage);

                // Only show certain page numbers and ellipsis
                if (
                  pageNumbersToShow.includes(pageNumber) ||
                  Math.ceil(users.length / usersPerPage) <= 5 ||
                  (pageNumber <= 5 &&
                    Math.ceil(users.length / usersPerPage) <= 7)
                ) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => paginate(pageNumber)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        pageNumber === currentPage
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-500 hover:bg-gray-50"
                      }`}
                      style={
                        pageNumber === currentPage
                          ? { backgroundColor: "#3B82DE" }
                          : {}
                      }
                    >
                      {pageNumber}
                    </button>
                  );
                }
                // Show ellipsis for skipped pages
                else if (
                  (pageNumber === 2 && currentPage > 3) ||
                  (pageNumber === Math.ceil(users.length / usersPerPage) - 1 &&
                    currentPage < Math.ceil(users.length / usersPerPage) - 2)
                ) {
                  return (
                    <span
                      key={pageNumber}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                    >
                      ...
                    </span>
                  );
                }
                return null;
              })}

              <button
                onClick={() => {
                  if (currentPage < Math.ceil(users.length / usersPerPage)) {
                    paginate(currentPage + 1);
                  }
                }}
                disabled={
                  currentPage === Math.ceil(users.length / usersPerPage) ||
                  users.length === 0
                }
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                  currentPage === Math.ceil(users.length / usersPerPage) ||
                  users.length === 0
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }`}
                style={
                  currentPage !== Math.ceil(users.length / usersPerPage) &&
                  users.length > 0
                    ? { backgroundColor: "#EFF6FF" }
                    : {}
                }
              >
                <span className="sr-only">Next</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUser;
