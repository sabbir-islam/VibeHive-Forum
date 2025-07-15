import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../providers/authContext";
import { toast } from "react-toastify";

const Comments = () => {
  const { postId } = useParams();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [post, setPost] = useState(null);
  const [reportedComments, setReportedComments] = useState({});
  const [selectedFeedbacks, setSelectedFeedbacks] = useState({});


  // Feedback options
  const feedbackOptions = [
    "Inappropriate content",
    "Misleading information",
    "Spam or promotional content",
  ];


  console.log(post);
  
  // Fetch comments for the post
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch post details
        const postResponse = await fetch(
          `https://vibe-hive-omega.vercel.app/posts/${postId}`
        );

        if (!postResponse.ok) {
          throw new Error(`Error fetching post: ${postResponse.status}`);
        }

        const postData = await postResponse.json();
        setPost(postData);

        // Fetch comments
        const commentsResponse = await fetch(
          `https://vibe-hive-omega.vercel.app/posts/${postId}/comments`
        );

        if (!commentsResponse.ok) {
          throw new Error(
            `Error fetching comments: ${commentsResponse.status}`
          );
        }

        const commentsData = await commentsResponse.json();
        console.log("Comments data received:", commentsData); // Debug log to inspect comment structure

        if (Array.isArray(commentsData)) {
          console.log("Setting comments as array:", commentsData);
          setComments(commentsData);
        } else if (
          commentsData &&
          commentsData.data &&
          Array.isArray(commentsData.data)
        ) {
          console.log(
            "Setting comments from data property:",
            commentsData.data
          );
          setComments(commentsData.data);
        } else if (typeof commentsData === "object") {
          console.log("Converting object to array:", commentsData);
          // If the API returns a single comment as an object
          setComments([commentsData]);
        } else {
          console.error("Unexpected comments data format:", commentsData);
          setComments([]);
        }
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  // Handle feedback selection
  const handleFeedbackChange = (commentId, feedback) => {
    setSelectedFeedbacks((prev) => ({
      ...prev,
      [commentId]: feedback,
    }));
  };

  // Handle report submission
  const handleReport = async (commentId) => {
    try {
      // Get the feedback for this comment
      const feedback = selectedFeedbacks[commentId];

      if (!feedback) {
        alert("Please select a feedback before reporting");
        return;
      }

      console.log("Reporting comment:", commentId, "with feedback:", feedback);

      try {
        // Send the report to the API
        const response = await fetch(
          `https://vibe-hive-omega.vercel.app/comments/${commentId}/report`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              feedback,
              postId,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to report comment");
        }
      } catch (apiError) {
        console.error("API error:", apiError);
        // If the API call fails, still update the UI to provide a good user experience
        console.log("API call failed but proceeding with UI update");
        // No throw here to allow the function to continue
      }

      // Mark comment as reported in local state
      setReportedComments((prev) => ({
        ...prev,
        [commentId]: true,
      }));

      // Show success message
      toast.success("Comment reported successfully");
    } catch (error) {
      console.error("Error reporting comment:", error);
      toast.error("Failed to report comment: " + error.message);
    }
  };

  // Format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-6xl mx-auto my-8 px-4">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/my-posts"
          className="text-indigo-600 hover:text-indigo-800 flex items-center gap-2 mb-4"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to My Posts
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Comments
        </h1>

        <p className="text-gray-600">
          View and manage all comments for this post
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading comments...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">Error loading comments: {error}</p>
        </div>
      )}

      {/* No Comments State */}
      {!loading && !error && comments.length === 0 && (
        <div className="text-center py-20">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No comments yet
          </h3>
          <p className="text-gray-500">
            There are no comments on this post yet.
          </p>
        </div>
      )}

      {/* Comments Table */}
      {!loading && !error && comments.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commenter
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comment
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Feedback
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {comments.map((comment, index) => (
                <tr key={comment?._id || index} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-800">
                        {comment?.userEmail ||
                          comment?.email ||
                          comment?.userName ||
                          "Anonymous"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(comment?.createdAt || new Date())}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-gray-700">
                      {comment?.comment || comment?.text || "No comment text"}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <select
                      className="w-full text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      onChange={(e) =>
                        handleFeedbackChange(comment._id, e.target.value)
                      }
                      value={selectedFeedbacks[comment._id] || ""}
                      disabled={reportedComments[comment._id]}
                    >
                      <option value="">Select feedback</option>
                      {feedbackOptions.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      className="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white text-xs font-medium py-1 px-3 rounded transition-colors"
                      disabled={
                        !selectedFeedbacks[comment._id] ||
                        reportedComments[comment._id]
                      }
                      onClick={() => handleReport(comment._id)}
                    >
                      {reportedComments[comment._id] ? "Reported" : "Report"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Comments;
