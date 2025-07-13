import React, { useState, useEffect } from "react";
import { useAuth } from "../../providers/authContext";
import { toast } from "react-toastify";

const ForumPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState({});
  const [postComments, setPostComments] = useState({});
  const [showComments, setShowComments] = useState({});
  const [loadingComments, setLoadingComments] = useState({});
  const [commentCounts, setCommentCounts] = useState({});
  const [selectedTag, setSelectedTag] = useState("");
  const [sortOption, setSortOption] = useState("newest"); // Add sort state
  const { currentUser } = useAuth();

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          "https://vibe-hive-omega.vercel.app/posts"
        );
        const data = await response.json();
        setPosts(data);

        // Fetch comment counts for all posts
        data.forEach((post) => {
          fetchCommentCount(post._id);
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Fetch comment count for a specific post
  const fetchCommentCount = async (postId) => {
    try {
      const response = await fetch(
        `https://vibe-hive-omega.vercel.app/posts/${postId}/comments`
      );
      const data = await response.json();
      setCommentCounts((prev) => ({
        ...prev,
        [postId]: data.length,
      }));
    } catch (error) {
      console.error("Error fetching comment count:", error);
    }
  };

  // Fetch comments for a specific post
  const fetchComments = async (postId) => {
    if (postComments[postId]) return; // Already fetched

    setLoadingComments((prev) => ({ ...prev, [postId]: true }));
    try {
      const response = await fetch(
        `https://vibe-hive-omega.vercel.app/posts/${postId}/comments`
      );
      const data = await response.json();
      setPostComments((prev) => ({
        ...prev,
        [postId]: data,
      }));
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setLoadingComments((prev) => ({ ...prev, [postId]: false }));
    }
  };

  // Toggle comments visibility
  const toggleComments = (postId) => {
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));

    // Fetch comments if showing and not already fetched
    if (!showComments[postId] && !postComments[postId]) {
      fetchComments(postId);
    }
  };

  // Handle vote actions
  const handleVote = async (postId, voteType) => {
    // Check if user is logged in
    if (!currentUser) {
      toast.error("Please log in to vote on posts!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    try {
      // Make API call to update the vote on the server
      const response = await fetch(
        `https://vibe-hive-omega.vercel.app/posts/${postId}/vote`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            voteType,
            userEmail: currentUser.email,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to vote");
      }

      const data = await response.json();

      // Update local state with the response from server
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post._id === postId) {
            return data.post;
          }
          return post;
        })
      );

      toast.success(
        `${voteType === "up" ? "Upvoted" : "Downvoted"} successfully!`,
        {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } catch (error) {
      console.error("Error voting:", error);
      toast.error("Failed to vote. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (postId) => {
    // Check if user is logged in
    if (!currentUser) {
      toast.error("Please log in to comment on posts!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    const commentText = comments[postId];
    if (!commentText || !commentText.trim()) {
      toast.error("Please enter a comment before submitting.", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    try {
      const response = await fetch(
        `https://vibe-hive-omega.vercel.app/posts/${postId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment: commentText,
            userEmail: currentUser.email,
            userName:
              currentUser.displayName || currentUser.email.split("@")[0],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const data = await response.json();

      // Add new comment to local state
      setPostComments((prev) => ({
        ...prev,
        [postId]: [data.comment, ...(prev[postId] || [])],
      }));

      // Update comment count
      setCommentCounts((prev) => ({
        ...prev,
        [postId]: (prev[postId] || 0) + 1,
      }));

      // Show success toast
      toast.success("Comment posted successfully!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Clear the comment field
      setComments((prev) => ({
        ...prev,
        [postId]: "",
      }));

      // Show comments if they weren't visible
      if (!showComments[postId]) {
        setShowComments((prev) => ({
          ...prev,
          [postId]: true,
        }));
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to post comment. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Handle comment input change
  const handleCommentChange = (postId, value) => {
    setComments((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .toUpperCase();
  };

  const tagList = [
    "technology",
    "programming",
    "design",
    "business",
    "science",
    "health",
    "other",
  ];

  // Handle sort option change
  const handleSortChange = (option) => {
    setSortOption(option);
  };

  // Sort posts based on selected sort option
  const sortPosts = (posts) => {
    if (!posts || !posts.length) return [];
    
    switch (sortOption) {
      case "popular":
        return [...posts].sort((a, b) => b.upVote - a.upVote);
      case "newest":
        return [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case "oldest":
        return [...posts].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case "mostComments":
        return [...posts].sort((a, b) => (commentCounts[b._id] || 0) - (commentCounts[a._id] || 0));
      default:
        return posts;
    }
  };

  // Filter posts by selected tag
  const filteredPosts = selectedTag
    ? posts.filter((post) => post.tag === selectedTag)
    : posts;

  // Apply sorting to filtered posts
  const sortedPosts = sortPosts(filteredPosts);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-2 sm:p-4">
      {/* Sort and Filter Options */}
      <div className="mb-5 flex flex-col md:flex-row gap-4">
        {/* Sort Dropdown */}
        <div className="w-full md:w-64">
          <label htmlFor="sort-select" className="block text-sm font-medium text-gray-700 mb-1">
            Sort by
          </label>
          <select
            id="sort-select"
            value={sortOption}
            onChange={(e) => handleSortChange(e.target.value)}
            className="block w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="newest">Newest</option>
            <option value="popular">Most Popular (Upvotes)</option>
            <option value="oldest">Oldest</option>
            <option value="mostComments">Most Comments</option>
          </select>
        </div>
      </div>
      
      {/* Tag Filters */}
      <div className="mb-5 grid md:grid-cols-4 gap-3">
        {tagList.map((tag) => (
          <button
            key={tag}
            className={`btn${
              selectedTag === tag ? " bg-blue-600 text-white" : ""
            }`}
            onClick={() => setSelectedTag(tag)}
          >
            #{tag}
          </button>
        ))}
        {selectedTag && (
          <button
            className="btn bg-gray-200 text-gray-700"
            onClick={() => setSelectedTag("")}
          >
            Show All
          </button>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-300">
        {/* Header - Hidden on mobile for cleaner look */}
        <div className="hidden sm:block border-b border-gray-200 p-4">
          <div className="flex">
            <div className="w-20 lg:w-24 text-sm font-medium text-gray-600">
              Author
            </div>
            <div className="flex-1 text-sm font-medium text-gray-600">
              Posts
            </div>
          </div>
        </div>

        {/* Posts */}
        {sortedPosts.length > 0 ? (
          sortedPosts.map((post, index) => (
            <div
              key={post._id}
              className={`border-b border-gray-200 ${
                index === sortedPosts.length - 1 ? "border-b-0" : ""
              }`}
            >
              {/* Post Content */}
              <div className="p-3 sm:p-4">
                {/* Date */}
                <div className="text-xs text-blue-600 font-medium mb-3 sm:mb-4">
                  {formatDate(post.createdAt || new Date().toISOString())}
                </div>

                {/* Mobile Layout: Stacked */}
                <div className="sm:hidden">
                  {/* Author Section - Mobile */}
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={post.authorImage}
                      alt={post.authorName}
                      className="w-10 h-10 rounded-full flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-blue-600 truncate">
                        {post.authorName}
                      </div>
                      <div className="text-xs text-blue-500 italic">
                        {post.tag}
                      </div>
                    </div>
                  </div>

                  {/* Post Content - Mobile */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-2 leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                      {post.description}
                    </p>

                    {/* Vote Buttons - Mobile */}
                    <div className="flex items-center gap-2 mb-4">
                      <button
                        onClick={() => handleVote(post._id, "up")}
                        className={`flex items-center gap-1 px-2 py-1 text-xs rounded-md transition-colors flex-1 justify-center sm:flex-initial sm:justify-start ${
                          currentUser
                            ? "bg-green-50 hover:bg-green-100 text-green-600 cursor-pointer"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                        disabled={!currentUser}
                      >
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="hidden xs:inline">Upvote</span> (
                        {post.upVote})
                      </button>

                      <button
                        onClick={() => handleVote(post._id, "down")}
                        className={`flex items-center gap-1 px-2 py-1 text-xs rounded-md transition-colors flex-1 justify-center sm:flex-initial sm:justify-start ${
                          currentUser
                            ? "bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                        disabled={!currentUser}
                      >
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="hidden xs:inline">Downvote</span> (
                        {post.downVote})
                      </button>
                    </div>

                    {/* Comment Section - Mobile */}
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder={
                          currentUser
                            ? "Write a comment..."
                            : "Please log in to comment..."
                        }
                        value={comments[post._id] || ""}
                        onChange={(e) =>
                          handleCommentChange(post._id, e.target.value)
                        }
                        className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none transition-colors ${
                          currentUser
                            ? "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                        }`}
                        disabled={!currentUser}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleCommentSubmit(post._id);
                          }
                        }}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCommentSubmit(post._id)}
                          className={`flex-1 px-4 py-2 text-sm rounded-md transition-colors ${
                            currentUser
                              ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                          disabled={!currentUser}
                        >
                          Reply
                        </button>
                        <button
                          onClick={() => toggleComments(post._id)}
                          className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                        >
                          {showComments[post._id] ? "Hide" : "View"} Comments
                          {commentCounts[post._id] !== undefined &&
                            commentCounts[post._id] > 0 && (
                              <span className="ml-1">
                                ({commentCounts[post._id]})
                              </span>
                            )}
                        </button>
                      </div>
                    </div>

                    {/* Comments Display - Mobile */}
                    {showComments[post._id] && (
                      <div className="mt-4 space-y-3">
                        {loadingComments[post._id] ? (
                          <div className="text-center text-gray-500 text-sm">
                            Loading comments...
                          </div>
                        ) : postComments[post._id] &&
                          postComments[post._id].length > 0 ? (
                          postComments[post._id].map((comment) => (
                            <div
                              key={comment._id}
                              className="bg-gray-50 p-3 rounded-md"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-gray-900">
                                  {comment.userName}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {formatDate(comment.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">
                                {comment.comment}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-gray-500 text-sm">
                            No comments yet
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Desktop Layout: Side by side */}
                <div className="hidden sm:flex gap-4">
                  {/* Author Section - Desktop */}
                  <div className="flex flex-col items-center w-20 lg:w-24 flex-shrink-0">
                    <img
                      src={post.authorImage}
                      alt={post.authorName}
                      className="w-12 h-12 lg:w-14 lg:h-14 rounded-full mb-2"
                    />
                    <div className="text-sm font-medium text-blue-600 text-center leading-tight">
                      {post.authorName}
                    </div>
                    <div className="text-xs text-blue-500 italic text-center">
                      {post.tag}
                    </div>
                  </div>

                  {/* Post Content - Desktop */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {post.description}
                    </p>

                    {/* Vote and Comment Section - Desktop */}
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      {/* Upvote Button */}
                      <button
                        onClick={() => handleVote(post._id, "up")}
                        className={`flex items-center gap-1 px-3 py-1 text-sm rounded-md transition-colors ${
                          currentUser
                            ? "bg-green-50 hover:bg-green-100 text-green-600 cursor-pointer"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                        disabled={!currentUser}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Upvote ({post.upVote})
                      </button>

                      {/* Downvote Button */}
                      <button
                        onClick={() => handleVote(post._id, "down")}
                        className={`flex items-center gap-1 px-3 py-1 text-sm rounded-md transition-colors ${
                          currentUser
                            ? "bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                        disabled={!currentUser}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Downvote ({post.downVote})
                      </button>

                      {/* View Comments Button */}
                      <button
                        onClick={() => toggleComments(post._id)}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
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
                        {showComments[post._id] ? "Hide" : "View"} Comments
                        {commentCounts[post._id] !== undefined &&
                          commentCounts[post._id] > 0 && (
                            <span className="ml-1">
                              ({commentCounts[post._id]})
                            </span>
                          )}
                      </button>
                    </div>

                    {/* Comment Section - Desktop */}
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        placeholder={
                          currentUser
                            ? "Write a comment..."
                            : "Please log in to comment..."
                        }
                        value={comments[post._id] || ""}
                        onChange={(e) =>
                          handleCommentChange(post._id, e.target.value)
                        }
                        className={`flex-1 px-3 py-2 border rounded-md focus:outline-none transition-colors ${
                          currentUser
                            ? "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                        }`}
                        disabled={!currentUser}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleCommentSubmit(post._id);
                          }
                        }}
                      />
                      <button
                        onClick={() => handleCommentSubmit(post._id)}
                        className={`px-4 py-2 rounded-md transition-colors whitespace-nowrap ${
                          currentUser
                            ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                        disabled={!currentUser}
                      >
                        Reply
                      </button>
                    </div>

                    {/* Comments Display - Desktop */}
                    {showComments[post._id] && (
                      <div className="space-y-3">
                        {loadingComments[post._id] ? (
                          <div className="text-center text-gray-500">
                            Loading comments...
                          </div>
                        ) : postComments[post._id] &&
                          postComments[post._id].length > 0 ? (
                          postComments[post._id].map((comment) => (
                            <div
                              key={comment._id}
                              className="bg-gray-50 p-3 rounded-md"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-gray-900">
                                  {comment.userName}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {formatDate(comment.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">
                                {comment.comment}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-gray-500">
                            No comments yet
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">
            No posts found matching your criteria
          </div>
        )}
      </div>
      
      {/* Display the total number of posts */}
      <div className="mt-4 text-sm text-gray-600 text-right">
        Showing {sortedPosts.length} {sortedPosts.length === 1 ? "post" : "posts"}
        {selectedTag && ` with tag #${selectedTag}`}
      </div>
    </div>
  );
};

export default ForumPosts;