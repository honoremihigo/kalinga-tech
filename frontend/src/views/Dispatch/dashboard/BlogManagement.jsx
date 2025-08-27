import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Check,
  AlertTriangle,
  BookOpen,
  Eye,
  ToggleLeft,
  X,
  Upload,
  Image,
} from "lucide-react";
import blogService from "../../../Services/Dispatch/blogService";
import { useNavigate } from "react-router-dom";

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [blogImage, setBlogImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    quote: "",
    status: "Active",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        const data = await blogService.getAllBlogs();
        setBlogs(data);
        setFilteredBlogs(data);
      } catch (error) {
        showNotification(`Failed to fetch blogs: ${error.message}`, "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    const filtered = blogs.filter(
      (blog) =>
        (blog.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (blog.content || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (blog.category || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBlogs(filtered);
  }, [searchTerm, blogs]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      category: "",
      quote: "",
      status: "Active",
    });
    setBlogImage(null);
    setImagePreview(null);
  };

  const handleAddBlog = async (blogData) => {
    setIsLoading(true);
    try {
      const validation = blogService.validateBlogData(blogData);
      if (!validation.isValid) {
        showNotification(validation.errors.join(", "), "error");
        return;
      }

      const preparedData = blogService.prepareBlogData(
        blogData,
        blogImage ? [blogImage] : []
      );
      const response = await blogService.createBlog(preparedData);
      setBlogs((prev) => [...prev, response]);
      setIsAddModalOpen(false);
      resetForm();
      showNotification("Blog added successfully!");
    } catch (error) {
      showNotification(`Failed to add blog: ${error.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditBlog = async (blogData) => {
    setIsLoading(true);
    try {
      const validation = blogService.validateBlogData(blogData);
      if (!validation.isValid) {
        showNotification(validation.errors.join(", "), "error");
        return;
      }

      const preparedData = blogService.prepareBlogData(
        blogData,
        blogImage ? [blogImage] : []
      );
      const updatedBlog = await blogService.updateBlog(
        selectedBlog.id,
        preparedData
      );
      setBlogs((prev) =>
        prev.map((blog) => (blog.id === selectedBlog.id ? updatedBlog : blog))
      );
      setIsEditModalOpen(false);
      setSelectedBlog(null);
      resetForm();
      showNotification("Blog updated successfully!");
    } catch (error) {
      showNotification(`Failed to update blog: ${error.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBlog = async () => {
    setIsLoading(true);
    try {
      await blogService.deleteBlog(selectedBlog.id);
      setBlogs((prev) => prev.filter((blog) => blog.id !== selectedBlog.id));
      setIsDeleteModalOpen(false);
      setSelectedBlog(null);
      showNotification("Blog deleted successfully!");
    } catch (error) {
      showNotification(`Failed to delete blog: ${error.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (blog) => {
    setIsLoading(true);
    try {
      const newStatus = blog.status === "Active" ? "Inactive" : "Active";
      const updatedBlog = await blogService.updateBlog(blog.id, {
        status: newStatus,
      });
      setBlogs((prev) => prev.map((b) => (b.id === blog.id ? updatedBlog : b)));
      showNotification(`Blog ${newStatus.toLowerCase()} successfully!`);
    } catch (error) {
      showNotification(
        `Failed to toggle blog status: ${error.message}`,
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openEditModal = (blog) => {
    setSelectedBlog(blog);
    setFormData({
      title: blog.title || "",
      content: blog.content || "",
      category: blog.category || "",
      quote: blog.quote || "",
    });
    setBlogImage(null);
    setImagePreview(null);
    setIsEditModalOpen(true);
  };

  const openViewModal = (blog) => {
    if (blog && blog.id) {
      navigate(`/dispatch/dashboard/blog-management/${blog.id}`);
    }
  };

  const openDeleteModal = (blog) => {
    setSelectedBlog(blog);
    setIsDeleteModalOpen(true);
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setBlogImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const removeImage = () => {
    setBlogImage(null);
    setImagePreview(null);
    // Reset the file input
    const fileInput = document.getElementById("blog-image");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditModalOpen) {
      handleEditBlog(formData);
    } else {
      handleAddBlog(formData);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-gray-50 p-4 h-[90vh] sm:p-6 lg:p-8">
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          } animate-in slide-in-from-top-2 duration-300`}
        >
          {notification.type === "success" ? (
            <Check size={16} />
          ) : (
            <AlertTriangle size={16} />
          )}
          {notification.message}
        </div>
      )}

      <div className="h-full overflow-y-auto mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Blog Management
            </h1>
          </div>
          <p className="text-gray-600">Manage your blogs and their content</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
            >
              <Plus size={20} />
              Add Blog
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading blogs...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No blogs found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm
                ? "Try adjusting your search terms."
                : "Get started by adding your first blog."}
            </p>
            {!searchTerm && (
              <button
                onClick={openAddModal}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Plus size={20} />
                Add Blog
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">
                      Blog
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">
                      Title
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">
                      Category
                    </th>
                  
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">
                      Created
                    </th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBlogs.map((blog) => (
                    <tr
                      key={blog.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {blog.title?.[0] || "B"}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {blog.title ? (
                          <span className="text-sm text-gray-600 truncate block max-w-xs">
                            {blog.title}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">
                            No title
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {blogService.formatCategory(blog.category) ||
                            "Uncategorized"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-600">
                          {formatDate(blog.createdAt)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openViewModal(blog)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => openEditModal(blog)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(blog)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {isEditModalOpen ? "Edit Blog" : "Add New Blog"}
                </h2>
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                    setSelectedBlog(null);
                    resetForm();
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Blog Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        handleFormChange("title", e.target.value)
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter blog title"
                    />
                  </div>

                  <div className="md:col-span-2" >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) =>
                        handleFormChange("category", e.target.value)
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter category"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quote (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.quote}
                      onChange={(e) =>
                        handleFormChange("quote", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter a quote"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Content
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) =>
                        handleFormChange("content", e.target.value)
                      }
                      required
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                      placeholder="Enter blog content"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blog Image (Optional)
                    </label>

                    {/* Image Upload Area */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      {imagePreview ? (
                        <div className="space-y-4">
                          <div className="relative inline-block">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={removeImage}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {blogImage?.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {blogImage &&
                                (blogImage.size / 1024 / 1024).toFixed(2)}{" "}
                              MB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              document.getElementById("blog-image").click()
                            }
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Change Image
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Upload className="w-6 h-6 text-gray-400" />
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() =>
                                document.getElementById("blog-image").click()
                              }
                              className="text-sm font-medium text-blue-600 hover:text-blue-700"
                            >
                              Click to upload
                            </button>
                            <span className="text-sm text-gray-500">
                              {" "}
                              or drag and drop
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      )}

                      <input
                        id="blog-image"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setIsEditModalOpen(false);
                      setSelectedBlog(null);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading
                      ? "Saving..."
                      : isEditModalOpen
                      ? "Update Blog"
                      : "Add Blog"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && selectedBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  View Blog
                </h2>
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setSelectedBlog(null);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {selectedBlog.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span>
                      Category:{" "}
                      {blogService.formatCategory(selectedBlog.category)}
                    </span>
                    <span>Status: {selectedBlog.status || "Active"}</span>
                    <span>Created: {formatDate(selectedBlog.createdAt)}</span>
                  </div>
                </div>

                {selectedBlog.quote && (
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                    <p className="italic text-gray-700">
                      "{selectedBlog.quote}"
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Content:</h4>
                  <div className="prose max-w-none text-gray-700 bg-gray-50 p-4 rounded-lg">
                    {selectedBlog.content}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && selectedBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Delete Blog
                  </h2>
                  <p className="text-gray-600">This action cannot be undone.</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">
                  You are about to delete:
                </p>
                <div className="font-medium text-gray-900">
                  {selectedBlog.title || "Untitled Blog"}
                </div>
                <div className="text-sm text-gray-600">
                  Category: {blogService.formatCategory(selectedBlog.category)}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedBlog(null);
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteBlog}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Deleting..." : "Delete Blog"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;
