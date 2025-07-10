import React from 'react';
import { useLoaderData } from 'react-router';

const UserProfile = () => {
  const userData = useLoaderData();
  const { 
    name, 
    photo, 
    email, 
    isMember = false, 
    posts = [], 
    uid,
    createdAt
  } = userData || {};
  
  // Check if this is the user's own profile
  const isMyProfile = uid === "nM5L762x9iNOIC5XMlixytYkOjj1";
  
  // Format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Only show 3 most recent posts
  const recentPosts = posts.slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto my-8 bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-100 p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar Section with Badge */}
          <div className="relative">
            <img 
              src={photo || "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg"} 
              alt={name} 
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
            />
            
            {isMyProfile && (
              <div className="absolute -bottom-2 -right-2">
                {isMember ? (
                  <div className="flex items-center bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full shadow-md">
                    <span className="text-lg mr-1">🏆</span>
                    <span className="text-xs font-bold">Gold</span>
                  </div>
                ) : (
                  <div className="flex items-center bg-amber-700 text-white px-3 py-1 rounded-full shadow-md">
                    <span className="text-lg mr-1">🥉</span>
                    <span className="text-xs font-bold">Bronze</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* User Info */}
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
            <p className="text-gray-600 mt-1">{email}</p>
            <p className="text-gray-500 text-sm mt-1">
              Member since: {formatDate(createdAt || "2025-07-10T06:29:05Z")}
            </p>
            
            {isMember && (
              <span className="mt-3 inline-block bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full">
                Gold Member
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Profile Content */}
      <div className="p-6">
        {/* Recent Posts Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 pb-3 border-b border-gray-200 mb-6">
            Recent Posts
          </h2>
          
          {recentPosts.length === 0 ? (
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
                <div key={post.id || index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  {post.coverImage && (
                    <div className="h-44 overflow-hidden">
                      <img 
                        src={post.coverImage} 
                        alt={post.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
                      {post.title || `Post ${index + 1}`}
                    </h3>
                    
                    <div className="flex justify-between items-center text-gray-500 text-xs mb-3">
                      <span>{formatDate(post.createdAt || "2025-07-10")}</span>
                      {post.category && (
                        <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                          {post.category}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt || post.content?.slice(0, 120) + '...' || "This is a sample post content. Click to read more."}
                    </p>
                    
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center transition-colors">
                      Read More
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
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