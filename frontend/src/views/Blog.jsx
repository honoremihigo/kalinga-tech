import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowRightIcon,
  CalendarIcon,
  ClockIcon,
} from "@heroicons/react/16/solid";
import blogService from "../Services/Dispatch/blogService";
import { User2 } from "lucide-react";

function Blog() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch blogs when component mounts
  useEffect(() => {
    document.documentElement.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "start",
    });

    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await blogService.getAllBlogs();
        // Sort blogs by date descending
        const sortedBlogs = response.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Header title="News And Update" />
        <section className="py-8 px-2 sm:px-6 lg:px-4">
          <div className="max-w-9xl mx-auto">
            <p className="text-center text-gray-600">Loading blogs...</p>
          </div>
        </section>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Header title="News And Update" />
        <section className="py-8 px-2 sm:px-6 lg:px-4">
          <div className="max-w-9xl mx-auto">
            <p className="text-center text-red-600">Error: {error}</p>
          </div>
        </section>
      </div>
    );
  }

  // Render blog posts
  const blogDataElement = blogs.map((blog) => {
    return (
      <article
        key={blog._id || blog.id}
        onClick={() => navigate(`/blog/${blog._id || blog.id}`)}
        className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
      >
        {/* Image Container */}
        <div className="relative overflow-hidden h-48 md:h-64">
          <img
            src={blogService.getFileUrl(blog.blogImage)}
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
              <span>5 min</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Date */}
          <div className="flex gap-2 " >
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
              <CalendarIcon className="w-4 h-4" />
              <span>{blogService.formatBlogDate(blog.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
              <User2 className="w-4 h-4" />
              <span>{blog.admin.names}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
            {blog.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {blogService.getBlogExcerpt(blog.content)}
          </p>

          {/* Read More Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/blog/${blog._id || blog.id}`);
            }}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm group-hover:gap-3 transition-all duration-300"
          >
            Read More
            <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </article>
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header title="News And Update" />
      {/* Blog Grid */}
      <section className="py-8 px-2 sm:px-6 lg:px-4">
        <div className="max-w-9xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogDataElement}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Blog;
