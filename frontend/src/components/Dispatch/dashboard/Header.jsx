import {
  Bell,
  User,
  LogOut,
  Lock,
  Globe,
  Wifi,
  WifiOff,
  Moon,
  Sun,
  Menu,
  X,
  Maximize,
  Minimize,
  Settings2Icon,
  MailIcon,
  MessageSquare
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import adminServiceInstance from '../../../Services/Dispatch/Auth';
import { useLanguage } from '../../../context/LanguageContext';

// eslint-disable-next-line react/prop-types
const Header = ({ toggleSidebar, isSidebarOpen, isMobile }) => {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isMailDropdownOpen, setIsMailDropdownOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFullScreen, setIsFullScreen] = useState(false);

  const { currentLanguage, changeLanguage } = useLanguage();
  

  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const languageRef = useRef(null);
  const mailDropdownRef = useRef(null);

  const languages = [
    { code: 'EN', name: 'English', flag: '🇺🇸' },
    { code: 'FR', name: 'Français', flag: '🇫🇷' },
    { code: 'ES', name: 'Español', flag: '🇪🇸' },
    { code: 'DE', name: 'Deutsch', flag: '🇩🇪' }
  ];

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await adminServiceInstance.getProfile();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (languageRef.current && !languageRef.current.contains(event.target)) {
        setIsLanguageOpen(false);
      }
      if (mailDropdownRef.current && !mailDropdownRef.current.contains(event.target)) {
        setIsMailDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await adminServiceInstance.logout();
      navigate('/dispatch', { replace: true });
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const  handleGeneral = ()=>{
    navigate('/Dispatch/dashboard/general')
    setIsDropdownOpen(false)
  }
  
  const  handleViewProfile = ()=>{
    navigate('/Dispatch/dashboard/profile')
    
    setIsDropdownOpen(false)
  }

  const handleLock = async () => {
    try {
      await adminServiceInstance.lock();
      navigate('/dispatch/lock', { replace: true });
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Lock failed:', error);
    }
  };

  const handleMessages = () => {
    navigate( '/Dispatch/dashboard/send-message');
    setIsMailDropdownOpen(false);
  };

  const handleEmail = () => {
    navigate( '/Dispatch/dashboard/send-email');
    setIsMailDropdownOpen(false);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleUsername = (name) => {
    return adminServiceInstance.getInitials(name);
  };

  return (
    <header className={`flex text-black justify-between items-center px-3 md:px-6 py-2 bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm ${isDarkMode ? 'dark:bg-gray-800 dark:border-gray-700' : ''}`}>
      {/* Left Section */}
      <div className="flex items-center space-x-3">
        {isMobile && (
          <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden">
            {isSidebarOpen ? (
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
          <div className="text-sm sm:text-lg font-semibold text-gray-800 dark:text-black">
            <span className="hidden sm:inline">{getGreeting()}, </span>
            <span>{user?.names?.split(' ')[0] || 'User'}!</span>
            <span className="hidden sm:inline"> 👋</span>
          </div>
          <div className="hidden lg:flex items-center space-x-2 text-sm text-gray-500">
            <span>{formatTime(currentTime)}</span>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        <div className="hidden sm:flex items-center space-x-2">
          {isOnline ? (
            <div className="flex items-center space-x-1 text-green-600 text-sm">
              <Wifi className="w-4 h-4" />
              <span className="hidden md:inline">Online</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 text-red-600 text-sm">
              <WifiOff className="w-4 h-4" />
              <span className="hidden md:inline">Offline</span>
            </div>
          )}
        </div>

        <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Toggle theme">
          {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
        </button>

        {/* Fullscreen Toggle */}
        <button onClick={toggleFullScreen} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Fullscreen">
          {isFullScreen ? (
            <Minimize className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          ) : (
            <Maximize className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          )}
        </button>

        {/* Language Selector */}
        <div className="relative hidden md:block" ref={languageRef}>
          <button
            onClick={() => setIsLanguageOpen(!isLanguageOpen)}
            className="flex items-center space-x-1 px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Globe className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {currentLanguage}
            </span>
          </button>

          {isLanguageOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
              <div className="py-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      changeLanguage(lang.code);
                      setIsLanguageOpen(false);
                    }}
                    className={`flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      currentLanguage === lang.code ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="mr-3 text-lg">{lang.flag}</span>
                    <span>{lang.name}</span>
                    {currentLanguage === lang.code && (
                      <span className="ml-auto text-blue-600">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mail Dropdown */}
        <div className="relative" ref={mailDropdownRef}>
          <button 
            onClick={() => setIsMailDropdownOpen(!isMailDropdownOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <MailIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          {isMailDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
              <div className="py-1">
                <button
                  onClick={handleMessages}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <MessageSquare className="w-4 h-4 mr-3" />
                  Messages
                </button>
                <button
                  onClick={handleEmail}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <MailIcon className="w-4 h-4 mr-3" />
                  Email
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {handleUsername(user?.names)}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {user?.names?.split(' ')[0] || 'User'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-32">
                {user?.email || 'user@example.com'}
              </div>
            </div>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Hello, {user?.names?.split(' ')[0] || 'User'}!
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email || 'user@example.com'}
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={handleViewProfile}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <User className="w-4 h-4 mr-3" />
                  View Profile
                </button>

                {isMobile && (
                  <button
                    onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Globe className="w-4 h-4 mr-3" />
                    Language ({currentLanguage})
                  </button>
                )}

                <button
                  onClick={handleGeneral}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <Settings2Icon className="w-4 h-4 mr-3" />
                  General
                </button>
                <button
                  onClick={handleLock}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <Lock className="w-4 h-4 mr-3" />
                  Lock Screen
                </button>

                <div className="border-t border-gray-200 dark:border-gray-700 my-1" />

                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;