import React, { useState, useContext, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import { AuthContext } from "../providers/authContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddPost = () => {
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [postCount, setPostCount] = useState(0);
  const [membership, setMembership] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    authorImage: currentUser?.photoURL || "",
    authorName: currentUser?.displayName || "",
    authorEmail: currentUser?.email || "",
    title: "",
    description: "",
    tag: null,
    upVote: 0,
    downVote: 0,
  });

  useEffect(() => {
    const fetchMembershipAndPosts = async () => {
      try {
        // Fetch membership status
        const membershipResponse = await axios.get(
          `https://vibe-hive-omega.vercel.app/users/membership/${currentUser?.email}`
        );
        setMembership(membershipResponse.data);

        // Fetch today's posts count
        const postsResponse = await axios.get(
          `https://vibe-hive-omega.vercel.app/posts/${currentUser?.email}`
        );
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayPosts = postsResponse.data.filter(
          (post) => new Date(post.createdAt) >= today
        );
        setPostCount(todayPosts.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (currentUser?.email) {
      fetchMembershipAndPosts();
    }
  }, [currentUser]);

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

    if (!membership?.isActive || membership?.plan === "basic") {
      if (postCount >= 5) {
        toast.error(
          "You have reached your daily post limit. Upgrade to Premium for unlimited posts!"
        );
        navigate("/membership");
        return;
      }
    }

    setLoading(true);

    try {
      // Create form data for file upload
      const postData = {
        ...formData,
        tag: formData.tag?.value || "",
        upVote: parseInt(formData.upVote) || 0,
        downVote: parseInt(formData.downVote) || 0,
      };

      // If you need to upload the image first, you'd do that here
      // and then include the URL in postData

      // Replace with your API endpoint
      await axios.post("https://vibe-hive-omega.vercel.app/posts", postData);
      toast.success("Post added successfully!");

      // Reset form after successful submission
      setFormData({
        title: "",
        description: "",
        tag: null,
        upVote: 0,
        downVote: 0,
      });

      // After successful post creation, update the post count
      setPostCount((prev) => prev + 1);
    } catch (error) {
      console.error("Error adding post:", error);
      toast.error("Failed to add post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const tagOptions = [
    { value: "technology", label: "Technology" },
    { value: "programming", label: "Programming" },
    { value: "design", label: "Design" },
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
            <h2 className="text-2xl font-bold text-center mb-6">
              Create New Post
            </h2>

            {/* Post Limit Display */}
            {!membership?.isActive || membership?.plan === "basic" ? (
              <div className="text-sm text-gray-600 mb-4">
                Posts remaining today: {5 - postCount}/5
                {postCount >= 3 && (
                  <span className="ml-2 text-purple-600">
                    Upgrade to Premium for unlimited posts!
                  </span>
                )}
              </div>
            ) : null}

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

              {/* Hidden fields for upVote and downVote (default 0) */}
              <input type="hidden" name="upVote" value={0} />
              <input type="hidden" name="downVote" value={0} />

              {/* Submit Button */}
              <div className="form-control mt-8">
                <button
                  type="submit"
                  className={`btn btn-primary w-full ${
                    loading ? "loading" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? "Publishing..." : "Publish Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPost;
