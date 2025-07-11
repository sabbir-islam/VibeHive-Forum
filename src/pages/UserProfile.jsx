import React, { useState, useEffect } from "react";
import { useLoaderData } from "react-router";
import { useAuth } from "../providers/authContext";
import { toast } from "react-toastify";
import axios from "axios";

const UserProfile = () => {
  const userData = useLoaderData();
  const { name, photo, email, uid, createdAt } = userData || {};

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentCounts, setCommentCounts] = useState({});
  const [membership, setMembership] = useState(null);
  const [membershipLoading, setMembershipLoading] = useState(true);
  const { currentUser } = useAuth();

  // Check if this is the user's own profile
  const isMyProfile = uid === "nM5L762x9iNOIC5XMlixytYkOjj1";

  // Fetch user posts
  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!email) return;

      try {
        setLoading(true);
        console.log("Fetching posts for email:", email);
        const response = await fetch(
          `https://vibe-hive-omega.vercel.app/posts/${email}`
        );
        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched posts data:", data);
        setPosts(data || []);

        // Fetch comment counts for all posts
        if (data && data.length > 0) {
          data.forEach((post) => {
            fetchCommentCount(post._id);
          });
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [email]);

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

  // Fetch membership data
  useEffect(() => {
    const fetchMembership = async () => {
      if (!email) return;

      try {
        setMembershipLoading(true);
        const response = await axios.get(
          `https://vibe-hive-omega.vercel.app/users/membership/${email}`
        );
        setMembership(response.data);
      } catch (error) {
        console.error("Error fetching membership:", error);
        // Set default membership for users without membership
        setMembership({ plan: "basic", isActive: true });
      } finally {
        setMembershipLoading(false);
      }
    };

    fetchMembership();
  }, [email]);

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

  // Format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Only show 3 most recent posts
  const recentPosts = posts.slice(0, 3);

  // Function to render membership badge
  const renderMembershipBadge = () => {
    if (membershipLoading) {
      return (
        <div className="flex items-center bg-gray-200 text-gray-600 px-3 py-1 rounded-full shadow-md animate-pulse">
          <span className="text-xs font-bold">Loading...</span>
        </div>
      );
    }

    const isPremium = membership?.plan === "premium" && membership?.isActive;

    if (isPremium) {
      return (
        <div className="flex items-center bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900 px-3 py-1 rounded-full shadow-md">
          <span className="text-lg mr-1">🏆</span>
          <span className="text-xs font-bold">GOLD</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700 px-3 py-1 rounded-full shadow-md">
          <span className="text-lg mr-1">🥈</span>
          <span className="text-xs font-bold">SILVER</span>
        </div>
      );
    }
  };

  // Function to get membership status text
  const getMembershipStatus = () => {
    if (membershipLoading) return "Loading...";

    const isPremium = membership?.plan === "premium" && membership?.isActive;
    return isPremium ? "Premium Member" : "Basic Member";
  };

  // Function to get membership expiry
  const getMembershipExpiry = () => {
    if (!membership?.expireDate) return null;

    const expireDate = new Date(membership.expireDate);
    const now = new Date();
    const isExpired = expireDate < now;

    if (isExpired) {
      return "Membership Expired";
    } else {
      return `Expires: ${expireDate.toLocaleDateString()}`;
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-8 bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-100 p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar Section with Badge */}
          <div className="relative">
            <img
              src={
                photo ||
                "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg"
              }
              alt={name}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
            />

            {/* Membership Badge */}
            <div className="absolute -bottom-2 -right-2">
              {renderMembershipBadge()}
            </div>
          </div>

          {/* User Info */}
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
            <p className="text-gray-600 mt-1">{email}</p>
            <p className="text-gray-500 text-sm mt-1">
              Member since: {formatDate(createdAt || "2025-07-10T06:29:05Z")}
            </p>

            {/* Membership Status */}
            <div className="mt-3 space-y-2">
              <span
                className={`inline-block text-xs font-medium px-3 py-1 rounded-full ${
                  membership?.plan === "premium" && membership?.isActive
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {getMembershipStatus()}
              </span>

              {getMembershipExpiry() && (
                <div className="text-xs text-gray-500">
                  {getMembershipExpiry()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="p-6">
        {/* Recent Posts Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 pb-3 border-b border-gray-200 mb-6">
            Recent Posts ({posts.length})
          </h2>

          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading posts...</p>
            </div>
          ) : recentPosts.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No posts yet</p>
              {isMyProfile && (
                <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full text-sm font-medium transition-all">
                  Create your first post
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentPosts.map((post, index) => (
                <div
                  key={post._id || index}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Author Info */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={
                              post.authorImage ||
                              "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg"
                            }
                            alt={post.authorName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          {/* Small badge for post author */}
                          <div className="absolute -bottom-1 -right-1">
                            {membership?.plan === "premium" &&
                            membership?.isActive ? (
                              <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                                <span className="text-xs">🏆</span>
                              </div>
                            ) : (
                              <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center">
                                <span className="text-xs">🥈</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {post.authorName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {post.authorEmail}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                      {post.title}
                    </h3>

                    <div className="flex justify-between items-center text-gray-500 text-xs mb-3">
                      <span>{formatDate(post.createdAt || "2025-07-10")}</span>
                      {post.tag && (
                        <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full capitalize">
                          {post.tag}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.description?.slice(0, 120) + "..." ||
                        "No description available."}
                    </p>

                    {/* Votes and Comments */}
                    <div className="flex items-center gap-4 mb-4">
                      <button
                        onClick={() => handleVote(post._id, "up")}
                        className={`flex items-center gap-1 transition-colors ${
                          currentUser
                            ? "text-green-600 hover:text-green-700 cursor-pointer"
                            : "text-gray-400 cursor-not-allowed"
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
                            d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm">{post.upVote || 0}</span>
                      </button>
                      <button
                        onClick={() => handleVote(post._id, "down")}
                        className={`flex items-center gap-1 transition-colors ${
                          currentUser
                            ? "text-red-600 hover:text-red-700 cursor-pointer"
                            : "text-gray-400 cursor-not-allowed"
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
                            d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm">{post.downVote || 0}</span>
                      </button>
                      <div className="flex items-center gap-1 text-gray-500">
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

                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center transition-colors">
                      Read More
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
