import React, { useState, useEffect } from "react";
import { useAuth } from "../../providers/authContext";
import { toast } from "react-toastify";

const ForumPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState({});
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
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
      // Update local state immediately for better UX
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post._id === postId) {
            return {
              ...post,
              upVote: voteType === "up" ? post.upVote + 1 : post.upVote,
              downVote: voteType === "down" ? post.downVote + 1 : post.downVote,
            };
          }
          return post;
        })
      );

      // Here you would make an API call to update the vote on the server
      // await fetch(`https://vibe-hive-omega.vercel.app/posts/${postId}/vote`, {
      //     method: 'PATCH',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({ voteType })
      // });
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  // Handle comment submission
  const handleCommentSubmit = (postId) => {
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
    if (commentText && commentText.trim()) {
      // Here you would make an API call to submit the comment
      console.log(`Comment on post ${postId}: ${commentText}`);

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
    }
  };

  // Handle comment input change
  const handleCommentChange = (postId, value) => {
    setComments((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };



  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-2 sm:p-4">
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
        {posts.map((post, index) => (
          <div
            key={post._id}
            className={`border-b border-gray-200 ${
              index === posts.length - 1 ? "border-b-0" : ""
            }`}
          >
            {/* Post Content */}
            <div className="p-3 sm:p-4">
              {/* Date - Mobile: top, Desktop: as before */}
              <div className="text-xs text-blue-600 font-medium mb-3 sm:mb-4">
                JUL 10 AT 3:36 PM {/* Using current date/time you provided */}
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

                  {/* Vote Buttons - Mobile: Horizontal */}
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

                  {/* Comment Section - Mobile: Stacked */}
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
                    <button
                      onClick={() => handleCommentSubmit(post._id)}
                      className={`w-full px-4 py-2 text-sm rounded-md transition-colors ${
                        currentUser
                          ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                      disabled={!currentUser}
                    >
                      Reply
                    </button>
                  </div>
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
                  </div>

                  {/* Comment Section - Desktop */}
                  <div className="flex gap-2">
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
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForumPosts;
