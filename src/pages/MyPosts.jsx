import React, { useState, useEffect, use } from "react";
import { AuthContext } from "../providers/authContext";

const MyPosts = () => {
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {currentUser} = use(AuthContext)
  
  const currentUserEmail = currentUser.email

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

        const response = await fetch(
          `https://vibe-hive-omega.vercel.app/posts/${currentUserEmail}`
        );
        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
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

  // Format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle post deletion (you can implement this later)
  const handleDeletePost = async (postId) => {
    // Implement delete functionality
    console.log("Delete post:", postId);
  };

  // Handle post editing (you can implement this later)
  const handleEditPost = (postId) => {
    // Implement edit functionality
    console.log("Edit post:", postId);
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
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Create Your First Post
          </button>
        </div>
      )}

      {/* Posts Grid */}
      {!loading && !error && posts.length > 0 && (
        <div>
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-600">Total posts: {posts.length}</p>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Create New Post
            </button>
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
                    </div>

                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors">
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
