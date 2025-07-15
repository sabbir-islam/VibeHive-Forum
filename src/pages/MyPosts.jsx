import React, { useState, useEffect, use } from "react";
import { AuthContext } from "../providers/authContext";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentCounts, setCommentCounts] = useState({});
  const { currentUser } = use(AuthContext);
  const navigate = useNavigate();

  const currentUserEmail = currentUser.email;

  // Fetch user's posts
  useEffect(() => {
    const fetchMyPosts = async () => {
      if (!currentUserEmail) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log("Fetching posts for email:", currentUserEmail);

        const response = await axios.get(
          `https://vibe-hive-omega.vercel.app/posts/${currentUserEmail}`
        );
        console.log("Response status:", response.status);

        const data = response.data;
        console.log("Fetched posts data:", data);

        // Handle different response structures
        let postsArray = [];
        if (Array.isArray(data)) {
          postsArray = data;
        } else if (data && data.posts && Array.isArray(data.posts)) {
          postsArray = data.posts;
        } else if (data && data.data && Array.isArray(data.data)) {
          postsArray = data.data;
        }

        setPosts(postsArray);

        // Fetch comment counts for all posts
        if (postsArray.length > 0) {
          postsArray.forEach((post) => {
            fetchCommentCount(post._id);
          });
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError(error.message);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, [currentUserEmail]);

  // Fetch comment count for a specific post
  const fetchCommentCount = async (postId) => {
    try {
      const response = await axios.get(
        `https://vibe-hive-omega.vercel.app/posts/${postId}/comments`
      );
      const data = response.data;
      setCommentCounts((prev) => ({
        ...prev,
        [postId]: data.length,
      }));
    } catch (error) {
      console.error("Error fetching comment count:", error);
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

  // Handle post deletion
  const handleDeletePost = async (postId) => {
  // Show SweetAlert2 confirmation dialog with custom styling
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#4f46e5", 
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
    customClass: {
      title: "text-gray-800 font-bold",
      htmlContainer: "text-gray-600",
      popup: "rounded-lg shadow-md",
    },
  });

  // If user didn't confirm, exit the function
  if (!result.isConfirmed) return;

  try {
    // Show loading indicator
    Swal.fire({
      title: "Deleting...",
      text: "Please wait while we delete your post",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // Send delete request to the server using axios with email query parameter
    console.log(`Deleting post with ID: ${postId}`);

    // Add the email query parameter to the delete request
    try {
      const response = await axios.delete(
        `https://vibe-hive-omega.vercel.app/posts/${postId}?email=${currentUserEmail}`
      );
      console.log("Delete response:", response.data);
    } catch (firstError) {
      console.error("First delete attempt failed:", firstError);

      // If first attempt fails, try an alternative endpoint structure
      console.log("Trying alternative endpoint...");
      const altResponse = await axios.delete(
        `https://vibe-hive-omega.vercel.app/post/${postId}?email=${currentUserEmail}`
      );
      console.log("Alternative delete response:", altResponse.data);
    }

    // Remove the deleted post from the state
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));

    // Show success message with SweetAlert2
    Swal.fire({
      title: "Deleted!",
      text: "Your post has been deleted.",
      icon: "success",
      customClass: {
        title: "text-gray-800 font-bold",
        htmlContainer: "text-gray-600",
        popup: "rounded-lg shadow-md",
      },
    });
  } catch (error) {
    // Error handling code remains the same
    console.error("Error deleting post:", error);
    
    // Get detailed error message
    let errorMessage;

    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      console.error("Error response headers:", error.response.headers);

      errorMessage = `Error ${error.response.status}: ${
        error.response.data?.message ||
        error.response.statusText ||
        "Unknown error"
      }`;
    } else if (error.request) {
      console.error("Error request:", error.request);
      errorMessage =
        "No response received from server. Please check your connection.";
    } else {
      console.error("Error message:", error.message);
      errorMessage = error.message || "Unknown error occurred";
    }

    console.error("Detailed error:", errorMessage);
    setError(`Failed to delete post: ${errorMessage}`);

    // Show error message with SweetAlert2
    Swal.fire({
      title: "Error!",
      text: `Failed to delete post: ${errorMessage}`,
      icon: "error",
      customClass: {
        title: "text-gray-800 font-bold",
        htmlContainer: "text-gray-600",
        popup: "rounded-lg shadow-md",
      },
    });
  }
};

  // Handle post editing
  const handleEditPost = (postId) => {
    // Find the post to edit
    const postToEdit = posts.find((post) => post._id === postId);

    if (postToEdit) {
      // Navigate to the new edit post page with the post data
      navigate(`/edit-post/${postId}`, {
        state: {
          postData: postToEdit,
        },
      });
    } else {
      setError("Post not found. Please refresh the page and try again.");
    }
  };

  // Navigate to comments page
  const handleViewComments = (postId) => {
    navigate(`/comments/${postId}`);
  };

  return (
    <div className="max-w-6xl mx-auto my-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Posts</h1>
        <p className="text-gray-600">Manage all your posts here</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading your posts...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">Error loading posts: {error}</p>
        </div>
      )}

      {/* No Posts State */}
      {!loading && !error && posts.length === 0 && (
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No posts yet
          </h3>
          <p className="text-gray-500 mb-6">
            You haven't created any posts yet. Start sharing your thoughts!
          </p>
          <Link to={"/add-post"}>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Create Your First Post
            </button>
          </Link>
        </div>
      )}

      {/* Posts Grid */}
      {!loading && !error && posts.length > 0 && (
        <div>
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-600">Total posts: {posts.length}</p>
            <Link to="/add-post">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Create New Post
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <div
                key={post._id || index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Post Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          post.authorImage ||
                          "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg"
                        }
                        alt={post.authorName || "Author"}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {post.authorName || "Unknown Author"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(post.createdAt || new Date())}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditPost(post._id)}
                        className="text-gray-400 hover:text-indigo-600 transition-colors"
                        title="Edit post"
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete post"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {post.title || "Untitled Post"}
                  </h3>

                  {/* Tag */}
                  {post.tag && (
                    <div className="mb-3">
                      <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs capitalize">
                        {post.tag}
                      </span>
                    </div>
                  )}

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.description
                      ? post.description.length > 150
                        ? post.description.slice(0, 150) + "..."
                        : post.description
                      : "No description available."}
                  </p>

                  {/* Votes and Stats */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-green-600">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm">{post.upVote || 0}</span>
                      </div>
                      <div className="flex items-center gap-1 text-red-600">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm">{post.downVote || 0}</span>
                      </div>
                      <div
                        className="flex items-center gap-1 text-gray-500 cursor-pointer hover:text-indigo-600"
                        onClick={() => handleViewComments(post._id)}
                        title="View comments"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm">
                          {commentCounts[post._id] !== undefined
                            ? commentCounts[post._id]
                            : 0}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleViewComments(post._id)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPosts;
