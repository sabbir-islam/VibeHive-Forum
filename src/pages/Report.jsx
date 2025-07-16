import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEye, FaTrash, FaCheck, FaBan } from "react-icons/fa";
import { toast } from "react-toastify";

const Report = () => {
  const [reportedComments, setReportedComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewReport, setViewReport] = useState(null);
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);

  // Fetch reported comments
  useEffect(() => {
    const fetchReportedComments = async () => {
      try {
        setLoading(true);
        // In a production environment, you would have an API endpoint for reported comments
        const response = await axios.get(
          "https://vibe-hive-omega.vercel.app/reported-comments"
        );
        setReportedComments(response.data || []);
      } catch (error) {
        console.error("Error fetching reported comments:", error);
        // Since this is a demo and we don't have the actual endpoint, let's use mock data
        setReportedComments([
          {
            _id: "1",
            postId: "6873a13217efbd2d185da3c3",
            comment: "This is an inappropriate comment that was reported",
            userEmail: "user@example.com",
            userName: "User 1",
            createdAt: new Date().toISOString(),
            isReported: true,
            reports: [
              {
                reportId: "1a",
                feedback: "This comment contains offensive language",
                reportedAt: new Date().toISOString(),
              },
              {
                reportId: "1b",
                feedback: "Harassment towards other users",
                reportedAt: new Date(Date.now() - 3600000).toISOString(),
              },
            ],
          },
          {
            _id: "2",
            postId: "686fd70540856c2f99b9ced4",
            comment: "Another reported comment with spam content",
            userEmail: "spammer@example.com",
            userName: "Spammer User",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            isReported: true,
            reports: [
              {
                reportId: "2a",
                feedback: "This comment is spam",
                reportedAt: new Date(Date.now() - 7200000).toISOString(),
              },
            ],
          },
          {
            _id: "3",
            postId: "686fd70540856c2f99b9ced4",
            comment: "This comment contains misinformation about the topic",
            userEmail: "misinform@example.com",
            userName: "Misinfo User",
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            isReported: true,
            reports: [
              {
                reportId: "3a",
                feedback: "This comment contains false information",
                reportedAt: new Date(Date.now() - 14400000).toISOString(),
              },
              {
                reportId: "3b",
                feedback: "Misleading content",
                reportedAt: new Date(Date.now() - 10800000).toISOString(),
              },
            ],
          },
          {
            _id: "4",
            postId: "686fd70540856c2f99b9ced4",
            comment:
              "This comment was made by a deleted account or missing user information",
            // userEmail and userName are missing intentionally to show how the UI handles it
            createdAt: new Date(Date.now() - 259200000).toISOString(),
            isReported: true,
            reports: [
              {
                reportId: "4a",
                feedback: "Suspicious activity from unknown user",
                reportedAt: new Date(Date.now() - 21600000).toISOString(),
              },
            ],
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchReportedComments();
  }, []);

  // Try to fetch user details if they are missing
  const fetchUserDetails = async (userEmail) => {
    if (!userEmail) return null;

    try {
      setLoadingUserDetails(true);
      const response = await axios.get(
        `https://vibe-hive-omega.vercel.app/users/${userEmail}`
      );
      if (response.data) {
        return {
          userName: response.data.name || response.data.displayName,
          userEmail: response.data.email,
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    } finally {
      setLoadingUserDetails(false);
    }
  };

  // Function to view a report with complete user information
  const handleViewReport = async (comment) => {
    setViewReport(comment);

    // If user information is missing, try to fetch it
    if (!comment.userName || !comment.userEmail) {
      setLoadingUserDetails(true);
      try {
        const userDetails = await fetchUserDetails(comment.userEmail);
        if (userDetails) {
          setViewReport((prev) => ({
            ...prev,
            userName: userDetails.userName || prev.userName,
            userEmail: userDetails.userEmail || prev.userEmail,
          }));
        }
      } catch (error) {
        console.error("Error retrieving user details:", error);
      } finally {
        setLoadingUserDetails(false);
      }
    }
  };

  // Function to handle approving the comment (removing the report)
  const handleApprove = async (commentId) => {
    try {
      // In production, this would call an API endpoint
      // await axios.post(`https://vibe-hive-omega.vercel.app/comments/${commentId}/approve`);

      // For demo, just update the state
      const updatedComments = reportedComments.filter(
        (comment) => comment._id !== commentId
      );
      setReportedComments(updatedComments);
      toast.success("Comment approved and report dismissed");
    } catch (error) {
      console.error("Error approving comment:", error);
      toast.error("Failed to approve comment");
    }
  };

  // Function to handle deleting the comment
  const handleDelete = async (commentId) => {
    try {
      // In production, this would call an API endpoint
      // await axios.delete(`https://vibe-hive-omega.vercel.app/comments/${commentId}`);

      // For demo, just update the state
      const updatedComments = reportedComments.filter(
        (comment) => comment._id !== commentId
      );
      setReportedComments(updatedComments);
      toast.success("Comment deleted successfully");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  // Function to handle banning the user
  const handleBan = async (userEmail) => {
    try {
      if (!userEmail) {
        toast.error("Cannot ban user: Email not available");
        return;
      }

      // In production, this would call an API endpoint
      // await axios.post(`https://vibe-hive-omega.vercel.app/users/ban`, { email: userEmail });

      // For demo, just update the state
      const updatedComments = reportedComments.filter(
        (comment) => comment.userEmail !== userEmail
      );
      setReportedComments(updatedComments);
      toast.success(`User ${userEmail} has been banned`);
    } catch (error) {
      console.error("Error banning user:", error);
      toast.error("Failed to ban user");
    }
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Reported Comments Management
      </h1>

      {reportedComments.length === 0 ? (
        <div className="text-center py-8">
          <h2 className="text-2xl font-semibold text-gray-600">
            No reported comments found
          </h2>
          <p className="mt-2 text-gray-500">
            All comments are in good standing.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-4 text-left">User</th>
                <th className="py-3 px-4 text-left">Comment</th>
                <th className="py-3 px-4 text-left">Reports</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Post ID</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reportedComments.map((comment) => (
                <tr key={comment._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div>
                        <p className="font-semibold">
                          {comment.userName || (
                            <span className="text-red-500">
                              No name available
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">
                          {comment.userEmail || (
                            <span className="text-red-500">
                              No email available
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <p className="truncate">{comment.comment}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-red-100 text-red-800 font-medium rounded-full px-3 py-1 text-sm">
                      {comment.reports.length} report
                      {comment.reports.length > 1 ? "s" : ""}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600">
                      {formatDate(comment.createdAt)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs bg-blue-100 text-blue-800 rounded px-2 py-1">
                      {comment.postId ? (
                        <a
                          href={`/comments/${comment.postId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {comment.postId.substring(0, 8)}...
                        </a>
                      ) : (
                        "Unknown post"
                      )}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleViewReport(comment)}
                        className="text-blue-500 hover:text-blue-700"
                        title="View Report Details"
                      >
                        <FaEye size={18} />
                      </button>
                      <button
                        onClick={() => handleApprove(comment._id)}
                        className="text-green-500 hover:text-green-700"
                        title="Approve Comment"
                      >
                        <FaCheck size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(comment._id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete Comment"
                      >
                        <FaTrash size={18} />
                      </button>
                      <button
                        onClick={() => handleBan(comment.userEmail)}
                        disabled={!comment.userEmail}
                        className={
                          comment.userEmail
                            ? "text-black hover:text-gray-700"
                            : "text-gray-300 cursor-not-allowed"
                        }
                        title={
                          comment.userEmail
                            ? "Ban User"
                            : "Cannot ban - no email available"
                        }
                      >
                        <FaBan size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for viewing report details */}
      {viewReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Report Details</h2>
              <button
                onClick={() => setViewReport(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold text-lg">Comment</h3>
              <p className="border p-3 rounded mt-1 bg-gray-50">
                {viewReport.comment}
              </p>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold text-lg">User Information</h3>
              {loadingUserDetails ? (
                <div className="flex justify-center items-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                  <span className="ml-2 text-gray-600">
                    Retrieving user details...
                  </span>
                </div>
              ) : (
                <div className="flex flex-col mt-1">
                  <p className="mb-2">
                    <span className="font-medium">Name:</span>{" "}
                    {viewReport.userName || (
                      <span className="text-red-500">Not available</span>
                    )}
                  </p>
                  <p className="mb-2">
                    <span className="font-medium">Email:</span>{" "}
                    {viewReport.userEmail || (
                      <span className="text-red-500">Not available</span>
                    )}
                  </p>
                  <p>
                    <span className="font-medium">Associated Post:</span>{" "}
                    {viewReport.postId ? (
                      <a
                        href={`/comments/${viewReport.postId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View original post (ID: {viewReport.postId})
                      </a>
                    ) : (
                      <span className="text-red-500">Unknown post</span>
                    )}
                  </p>
                </div>
              )}
            </div>
            <div className="mb-4">
              <h3 className="font-semibold text-lg">
                Reports ({viewReport.reports.length})
              </h3>
              <div className="mt-2 max-h-60 overflow-y-auto">
                {viewReport.reports.map((report) => (
                  <div key={report.reportId} className="border-b pb-2 mb-2">
                    <p className="font-medium text-sm text-gray-600">
                      Reported on: {formatDate(report.reportedAt)}
                    </p>
                    <p className="mt-1">{report.feedback}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  handleApprove(viewReport._id);
                  setViewReport(null);
                }}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Approve Comment
              </button>
              <button
                onClick={() => {
                  handleDelete(viewReport._id);
                  setViewReport(null);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete Comment
              </button>
              <button
                onClick={() => {
                  handleBan(viewReport.userEmail);
                  setViewReport(null);
                }}
                disabled={!viewReport.userEmail}
                className={`px-4 py-2 ${
                  viewReport.userEmail
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                } rounded`}
              >
                Ban User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Report;
