import React, { useState, useEffect } from "react";
import bgImage from '../../assets/b1.svg';
import axios from "axios";
import { Link } from "react-router-dom";

const Banner = () => {
    const [searchText, setSearchText] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [stats, setStats] = useState({
        userCount: 0,
        forumCount: 0,
        topicCount: 0,
        replyCount: 0,
        tagCount: 7
    });
    const [statsLoading, setStatsLoading] = useState(true);

    // Fetch forum statistics
    useEffect(() => {
        const fetchStats = async () => {
            try {
                setStatsLoading(true);
                const response = await axios.get(`https://vibe-hive-omega.vercel.app/forum-stats`);
                setStats(response.data);
                setStatsLoading(false);
            } catch (err) {
                console.error("Error fetching forum stats:", err);
                setStatsLoading(false);
            }
        };

        fetchStats();
    }, []);

    const handleSearch = async () => {
        if (searchText.trim()) {
            try {
                setLoading(true);
                setShowResults(true);
                const response = await axios.get(`https://vibe-hive-omega.vercel.app/posts/search/${searchText.trim()}`);
                setSearchResults(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error searching posts:", err);
                setError("Failed to search. Please try again.");
                setLoading(false);
            }
        }
    };

    // Handle Enter key press for search
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Clear results when search text is cleared
    useEffect(() => {
        if (!searchText.trim()) {
            setSearchResults([]);
            setShowResults(false);
        }
    }, [searchText]);

    return (
        <div className="relative">
            <div
                className="relative h-[600px] flex items-center justify-center px-4 bg-cover bg-center"
                style={{
                    backgroundImage: `url(${bgImage})`,
                }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-slate-900 bg-opacity-80"></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto w-full px-6">
                    {/* Left Content */}
                    <div className="text-center md:text-left md:w-2/3">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Welcome to the Forum
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 mb-8">
                            Share your favorite opinion!
                        </p>

                        {/* Search Input with Button */}
                        <div className="flex flex-col max-w-md mx-auto md:mx-0">
                            <div className="flex w-full">
                                <input
                                    type="text"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Search posts by tag..."
                                    className="bg-white flex-1 px-4 py-3 rounded-l-md text-lg border-0 focus:outline-none focus:ring-2 placeholder-gray-400"
                                />
                                <button
                                    onClick={handleSearch}
                                    className="px-6 py-3 bg-[#3B82DE] hover:bg-[#3b56debc] text-white font-medium text-lg rounded-r-md transition-colors duration-200 cursor-pointer"
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="mt-10 md:mt-0 md:w-1/3">
                        <div className="bg-slate-800 bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-6 text-[#3B82DE] shadow-lg border border-slate-800 border-opacity-20">
                            {statsLoading ? (
                                <div className="flex justify-center items-center h-48">
                                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                                        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading stats...</span>
                                    </div>
                                </div>
                            ) : (
                                <ul className="space-y-4">
                                    <li className="flex justify-between items-center">
                                        <span className="font-medium">Registered Users</span>
                                        <span className="font-bold">{stats.userCount}</span>
                                    </li>
                                    <li className="flex justify-between items-center">
                                        <span className="font-medium">Forums</span>
                                        <span className="font-bold">{stats.forumCount}</span>
                                    </li>
                                    <li className="flex justify-between items-center">
                                        <span className="font-medium">Topics</span>
                                        <span className="font-bold">{stats.topicCount}</span>
                                    </li>
                                    <li className="flex justify-between items-center">
                                        <span className="font-medium">Replies</span>
                                        <span className="font-bold">{stats.replyCount}</span>
                                    </li>
                                    <li className="flex justify-between items-center">
                                        <span className="font-medium">Topic Tags</span>
                                        <span className="font-bold">7</span>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Results Section - Displayed below the banner */}
            {showResults && (
                <div className="bg-white py-8 px-4 shadow-lg">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-2xl font-bold mb-6">
                            Search Results for Tag: "{searchText}"
                        </h2>
                        
                        {loading ? (
                            <div className="text-center py-10">
                                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                                </div>
                                <p className="mt-2">Searching...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center text-red-500 py-10">{error}</div>
                        ) : searchResults.length === 0 ? (
                            <div className="text-center py-10">
                                <p>No posts found with tag "{searchText}"</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {searchResults.map((post) => (
                                    <div 
                                        key={post._id} 
                                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-200"
                                    >
                                        <div className="p-6">
                                            <Link to={`/posts/${post._id}`}>
                                                <h3 className="text-xl font-semibold mb-2 hover:text-blue-600">{post.title}</h3>
                                            </Link>
                                            <p className="text-gray-600 mb-4 line-clamp-3">{post.description}</p>
                                            <div className="flex justify-between items-center">
                                                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                                                    {post.tag}
                                                </span>
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                                                        </svg>
                                                        <span className="ml-1">{post.upVote || 0}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                        <span className="ml-1">{post.downVote || 0}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex items-center">
                                                <img 
                                                    src={post.authorImage} 
                                                    alt={post.authorName}
                                                    className="w-8 h-8 rounded-full mr-2"
                                                />
                                                <span className="text-sm text-gray-600">{post.authorName}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Banner;