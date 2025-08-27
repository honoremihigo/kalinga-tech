import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRightIcon, CalendarIcon, ClockIcon } from "@heroicons/react/16/solid";
import blogService from "../../Services/Dispatch/blogService";

function BlogCard() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the latest blogs when the component mounts
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await blogService.getAllBlogs();
        // Sort blogs by creation date (assuming createdAt field) and take the latest 3
        const sortedBlogs = response
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);
        setBlogs(sortedBlogs);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Render loading state
  if (loading) {
    return (
      <section className="py-14 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-9xl mx-auto text-center">
          <p className="text-gray-600">Loading blogs...</p>
        </div>
      </section>
    );
  }

  // Render error state
  if (error) {
    return (
      <section className="py-14 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-9xl mx-auto text-center">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </section>
    );
  }

  // Render blog cards
  const blogDataElement = blogs.map((blog) => (
    <article
      onClick={() => navigate(`/blog/${blog.id}`)}
      key={blog._id}
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden h-48 md:h-64">
        <img
          src={blogService.getFileUrl(blog.blogImage)} // Use getFileUrl to handle image URL
          alt={blog.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="inline-block bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-semibold border border-white/20">
            {blogService.formatCategory(blog.category)}
          </span>
        </div>
        {/* Read Time Badge */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm text-gray-700 px-2 py-1 rounded-full text-sm">
            <ClockIcon className="w-3 h-3" />
            <span>5 min</span> {/* Static for now; could calculate dynamically if needed */}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Date */}
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
          <CalendarIcon className="w-4 h-4" />
          <span>{blogService.formatBlogDate(blog.createdAt)}</span> {/* Format date */}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
          {blog.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {blogService.getBlogExcerpt(blog.content)} {/* Generate excerpt */}
        </p>

        {/* Read More Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/blog/${blog.id}`);
          }}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm group-hover:gap-3 transition-all duration-300"
        >
          Read More
          <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </article>
  ));

  return (
    <section className="py-14 px-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-9xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Blog & News
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Latest Stories & Updates
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay informed with our latest insights, news, and stories from the world of transportation and care services
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogDataElement}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate("/blog")}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            View All Posts
            <ArrowRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default BlogCard;