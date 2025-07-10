import React, { useState, useContext } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { AuthContext } from '../providers/authContext';


const AddPost = () => {
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    authorImage: '',
    authorName: currentUser?.name || '',
    authorEmail: currentUser?.email || '',
    title: '',
    description: '',
    tag: null,
    upVote: 0,
    downVote: 0
  });

  const tagOptions = [
    { value: 'technology', label: 'Technology' },
    { value: 'programming', label: 'Programming' },
    { value: 'design', label: 'Design' },
    { value: 'business', label: 'Business' },
    { value: 'science', label: 'Science' },
    { value: 'health', label: 'Health' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleTagChange = (selectedOption) => {
    setFormData({
      ...formData,
      tag: selectedOption
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create form data for file upload
      const postData = {
        ...formData,
        tag: formData.tag?.value || '',
        upVote: parseInt(formData.upVote) || 0,
        downVote: parseInt(formData.downVote) || 0
      };

      // If you need to upload the image first, you'd do that here
      // and then include the URL in postData

      // Replace with your API endpoint
      await axios.post('/api/posts', postData);
      
      // Reset form after successful submission
      setFormData({
        authorImage: '',
        authorName: currentUser?.name || '',
        authorEmail: currentUser?.email || '',
        title: '',
        description: '',
        tag: null,
        upVote: 0,
        downVote: 0
      });
      
      alert('Post added successfully!');
    } catch (error) {
      console.error('Error adding post:', error);
      alert('Failed to add post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-base-200 min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="text-2xl font-bold text-center mb-6">Create New Post</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Author Image</span>
                </label>
                <div className="flex items-center space-x-4">
                  <input 
                  type="text" 
                  name="authorImage" 
                  value={formData.authorName} 
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
                  <span className="label-text font-medium">Post Description</span>
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
                  className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Publishing...' : 'Publish Post'}
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