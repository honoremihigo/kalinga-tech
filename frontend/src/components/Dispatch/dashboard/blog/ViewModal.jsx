import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, User, Tag, Quote, Share2, Download, Loader2, AlertCircle } from 'lucide-react';
import blogService from '../../../../Services/Dispatch/blogService';
import { useParams } from 'react-router-dom';

const BlogViewPage = ( ) => {

    const { id:blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (blogId) {
      fetchBlogData();
    }
  }, [blogId]);

  const onBack = () => {
    window.history.back();
  };
  const fetchBlogData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const blogData = await blogService.getBlogById(blogId);
      
      if (!blogData) {
        setError('Blog not found');
        return;
      }
      
      setBlog(blogData);
    } catch (err) {
      console.error('Error fetching blog:', err);
      setError(err.message || 'Failed to load blog');
    } finally {
      setLoading(false);
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };



  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const handleShare = () => {
    if (navigator.share && blog) {
      navigator.share({
        title: blog.title,
        text: blogService.getBlogExcerpt(blog.content, 100),
        url: window.location.href
      }).catch(err => console.log('Error sharing:', err));
    } else {
      // Fallback to copy URL
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch(() => alert('Failed to copy link'));
    }
  };

  const handleDownloadImage = async () => {
    if (blog?.blogImage) {
      try {
        const imageUrl = blogService.getFileUrl(blog.blogImage);
        const fileName = `${blog.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_image.jpg`;
        await blogService.downloadFile(imageUrl, fileName);
      } catch (err) {
        console.error('Error downloading image:', err);
        alert('Failed to download image');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Blog</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-x-4">
            <button
              onClick={fetchBlogData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            {onBack && (
              <button
                onClick={onBack}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Go Back
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Blog Not Found</h2>
          <p className="text-gray-600 mb-6">The blog you're looking for doesn't exist.</p>
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className=" mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Blogs
              </button>
            )}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleShare}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Share this blog"
              >
                <Share2 className="w-5 h-5" />
              </button>
              {blog.blogImage && (
                <button
                  onClick={handleDownloadImage}
                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Download image"
                >
                  <Download className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className=" mx-auto px-4 py-8">
        <article className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Blog Image */}
          {blog.blogImage && (
            <div className="relative h-64 md:h-80 lg:h-96 bg-gray-200 overflow-hidden">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              )}
              {!imageError ? (
                <img
                  src={blogService.getFileUrl(blog.blogImage)}
                  alt={blog.title}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    imageLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="text-center text-gray-500">
                    <AlertCircle className="w-12 h-12 mx-auto mb-2" />
                    <p>Image not available</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Blog Content */}
          <div className="p-6 md:p-8">
            {/* Category */}
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                <Tag className="w-4 h-4 mr-1" />
                {blogService.formatCategory(blog.category)}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">
              {blog.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span className="font-medium">
                  {blog.admin?.names || 'Unknown Author'}
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{blogService.formatBlogDate(blog.createdAt)}</span>
              </div>
            </div>

            {/* Quote */}
            {blog.quote && (
              <blockquote className="relative mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-r-lg">
                <Quote className="absolute top-4 left-4 w-6 h-6 text-blue-400 opacity-50" />
                <p className="text-lg md:text-xl font-medium text-gray-800 italic pl-8">
                  "{blog.quote}"
                </p>
              </blockquote>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-gray-700 leading-relaxed whitespace-pre-line"
                style={{ 
                  lineHeight: '1.8',
                  fontSize: '1.1rem'
                }}
              >
                {blog.content}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    <span>Published by </span>
                    <span className="font-medium text-gray-800 ml-1">
                      {blog.admin?.names || 'Unknown Author'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleShare}
                    className="flex items-center px-4 py-2 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Additional Information */}
        {blog.admin?.email && (
          <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">About the Author</h3>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {blog.admin.names?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div>
                <p className="font-medium text-gray-800">{blog.admin.names}</p>
                <p className="text-sm text-gray-600">{blog.admin.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default BlogViewPage;