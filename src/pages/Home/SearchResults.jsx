import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const SearchResults = () => {
    const { tag } = useParams();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                // Make sure to use your correct API base URL
                const response = await axios.get(`https://vibe-hive-omega.vercel.app/posts/search/${tag}`);
                setPosts(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching search results:", err);
                setError("Failed to load search results. Please try again.");
                setLoading(false);
            }
        };

        if (tag) {
            fetchPosts();
        }
    }, [tag]);

    if (loading) return <div className="text-center py-10">Loading search results...</div>;
    if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Search Results for Tag: "{tag}"</h1>
            
            {posts.length === 0 ? (
                <div className="text-center py-10">
                    <p>No posts found with tag "{tag}"</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <div 
                            key={post._id} 
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            <div className="p-6">
                                <Link to={`/posts/${post._id}`}>
                                    <h2 className="text-xl font-semibold mb-2 hover:text-blue-600">{post.title}</h2>
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
    );
};

export default SearchResults;