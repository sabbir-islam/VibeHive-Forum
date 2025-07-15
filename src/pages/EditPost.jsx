import React, { useState, useContext, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import { AuthContext } from "../providers/authContext";
import { toast } from "react-toastify";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const EditPost = () => {
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [fetchingPost, setFetchingPost] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { postId } = useParams(); // Get post ID from URL parameters

  // Initialize form data with empty values
  const [formData, setFormData] = useState({
    authorImage: "",
    authorName: "",
    authorEmail: "",
    title: "",
    description: "",
    tag: null,
    upVote: 0,
    downVote: 0,
  });

  // Fetch post data when component mounts
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setFetchingPost(true);

        // First try to get post data from location state if available
        if (location.state?.postData) {
          const postData = location.state.postData;
          setFormData({
            ...postData,
            tag: postData.tag
              ? {
                  value: postData.tag,
                  label:
                    postData.tag.charAt(0).toUpperCase() +
                    postData.tag.slice(1),
                }
              : null,
          });
          setFetchingPost(false);
          return;
        }

        // If no state data, fetch from API using postId from URL
        if (postId) {
          const response = await axios.get(
            `https://vibe-hive-omega.vercel.app/posts/post/${postId}`
          );

          const postData = response.data;

          // Verify the current user is the author of the post
          if (postData.authorEmail !== currentUser?.email) {
            toast.error("You can only edit your own posts");
            navigate("/my-posts");
            return;
          }

          setFormData({
            ...postData,
            tag: postData.tag
              ? {
                  value: postData.tag,
                  label:
                    postData.tag.charAt(0).toUpperCase() +
                    postData.tag.slice(1),
                }
              : null,
          });
        }
      } catch (error) {
        console.error("Error fetching post data:", error);
        toast.error("Failed to fetch post data. Please try again.");
        navigate("/my-posts");
      } finally {
        setFetchingPost(false);
      }
    };

    fetchPostData();
  }, [postId, location.state, currentUser?.email, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTagChange = (selectedOption) => {
    setFormData({
      ...formData,
      tag: selectedOption,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create form data for submission
      const postData = {
        ...formData,
        tag: formData.tag?.value || "",
        upVote: parseInt(formData.upVote) || 0,
        downVote: parseInt(formData.downVote) || 0,
      };

      // Update existing post
      await axios.put(
        `https://vibe-hive-omega.vercel.app/posts/${postId || formData._id}`,
        postData
      );
      toast.success("Post updated successfully!");

      // Redirect to My Posts page after successful operation
      navigate("/my-posts");
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const tagOptions = [
    { value: "technology", label: "Technology" },
    { value: "programming", label: "Programming" },
    { value: "travel", label: "Travel" },
    { value: "business", label: "Business" },
    { value: "science", label: "Science" },
    { value: "health", label: "Health" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="bg-base-200 min-h-screen mb-20 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="text-2xl font-bold text-center mb-6">Edit Post</h2>

            {/* Loading State */}
            {fetchingPost && (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            )}

            {!fetchingPost && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Author Image</span>
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      name="authorImage"
                      value={formData.authorImage}
                      onChange={handleInputChange}
                      placeholder="Enter image url"
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                </div>

                {/* Author Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Author Name</span>
                  </label>
                  <input
                    type="text"
                    name="authorName"
                    value={formData.authorName}
                    onChange={handleInputChange}
                    placeholder="Enter author name"
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                {/* Author Email (from context) */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Author Email</span>
                  </label>
                  <input
                    type="email"
                    name="authorEmail"
                    value={formData.authorEmail}
                    className="input input-bordered w-full bg-gray-100"
                    readOnly
                  />
                </div>

                {/* Post Title */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Post Title</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter post title"
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                {/* Post Description */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Post Description
                    </span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Write your post content here..."
                    className="textarea textarea-bordered h-32"
                    required
                  />
                </div>

                {/* Tag Selection */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Tag</span>
                  </label>
                  <Select
                    name="tag"
                    value={formData.tag}
                    onChange={handleTagChange}
                    options={tagOptions}
                    className="basic-single"
                    classNamePrefix="select"
                    placeholder="Select a tag"
                    isSearchable
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="form-control mt-8">
                  <button
                    type="submit"
                    className={`btn btn-primary w-full ${
                      loading ? "loading" : ""
                    }`}
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Post"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
