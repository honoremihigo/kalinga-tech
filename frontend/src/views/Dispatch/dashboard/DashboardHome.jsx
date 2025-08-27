import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  MessageSquare, 
  FileText, 
  Package, 
  TrendingUp, 
  Users,
  Calendar,
  Eye,
  Send,
  MessageCircle,
  Laptop,
  BookOpen
} from 'lucide-react';
import blogService from '../../../Services/Dispatch/blogService';
import productService from '../../../Services/Dispatch/productService';
import { sendMessage, getSentMessages, getInboxMessages } from '../../../Services/Dispatch/messageService';

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalProducts: 0,
    totalMessages: 0,
    sentMessages: 0,
    receivedMessages: 0,
    totalCategories: 0
  });
  
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch blogs data
      const blogsData = await blogService.getAllBlogs();
      const categoriesData = await blogService.getBlogCategories();
      
      // Fetch products data
      const productsData = await productService.getAllProducts();
      
      // Fetch messages data
      const inboxMessages = await getInboxMessages();
      const sentCount = inboxMessages.filter(msg => msg.direction === 'SENT').length;
      const receivedCount = inboxMessages.filter(msg => msg.direction === 'RECEIVED').length;
      
      // Set statistics
      setStats({
        totalBlogs: blogsData?.length || 0,
        totalProducts: productsData?.length || 0,
        totalMessages: inboxMessages?.length || 0,
        sentMessages: sentCount,
        receivedMessages: receivedCount,
        totalCategories: categoriesData?.length || 0
      });
      
      // Set recent data (last 5 items)
      setRecentBlogs(blogsData?.slice(0, 5) || []);
      setRecentProducts(productsData?.slice(0, 5) || []);
      setRecentMessages(inboxMessages?.slice(0, 5) || []);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-l-blue-500 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{loading ? '...' : value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const TableCard = ({ title, icon: Icon, children, color }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className={`${color} px-6 py-4`}>
        <div className="flex items-center space-x-3">
          <Icon className="w-6 h-6 text-white" />
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
      </div>
      <div className="overflow-x-auto">
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome to your admin dashboard. Here's what's happening with your system.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Blogs"
            value={stats.totalBlogs}
            icon={FileText}
            color="bg-blue-500"
            subtitle="Published articles"
          />
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon={Package}
            color="bg-green-500"
            subtitle="Laptop inventory"
          />
          <StatCard
            title="Total Messages"
            value={stats.totalMessages}
            icon={MessageSquare}
            color="bg-purple-500"
            subtitle="All communications"
          />
          <StatCard
            title="Messages Sent"
            value={stats.sentMessages}
            icon={Send}
            color="bg-orange-500"
            subtitle="Outbound messages"
          />
          <StatCard
            title="Messages Received"
            value={stats.receivedMessages}
            icon={MessageCircle}
            color="bg-red-500"
            subtitle="Inbound messages"
          />
          <StatCard
            title="Blog Categories"
            value={stats.totalCategories}
            icon={BarChart3}
            color="bg-indigo-500"
            subtitle="Content categories"
          />
        </div>

      

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;