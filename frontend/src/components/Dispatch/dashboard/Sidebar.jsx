import {
  BarChart,
  ShoppingCart,
  MessageCircle,
  Settings,
  Package,
  UserCog,
  Wallet,
  CarFront,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Settings2Icon,
  User,
  Briefcase,
  LocateIcon,
  Plus,
  List,
  Eye,
  Edit,
  Trash2,
  UsersRound,
  PackageOpen,
  TestTube
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import Logo from '../../../assets/images/abyride-logo.png';

const Sidebar = () => {
  const [openDropdowns, setOpenDropdowns] = useState({});

  const toggleDropdown = (itemPath) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [itemPath]: !prev[itemPath]
    }));
  };
  const menuItems = [
    {
      path: '/Dispatch/dashboard/dashboard-overview',
      name: 'Dashboard Overview',
      icon: MessageCircle
    },
    {
      path: '/Dispatch/dashboard/ContactMessages',
      name: 'Contact Messages',
      icon: MessageCircle
    },
    {
      path: '/Dispatch/dashboard/blog-management',
      name: 'blog Management',
      icon: BarChart,
    },
    {
      path: '/Dispatch/dashboard/product-management',
      name: 'product Management',
      icon: PackageOpen,
    },
 ];

  const renderMenuItem = (item) => {
    const Icon = item.icon;
    const isDropdownOpen = openDropdowns[item.path];
    const hasActiveChild = item.dropdownItems?.some(child => 
      window.location.pathname === child.path
    );

    if (item.hasDropdown) {
      return (
        <div key={item.path} className="mb-1.5">
          {/* Main menu item */}
          <div
            onClick={() => toggleDropdown(item.path)}
            className={`flex items-center p-2.5 text-gray-600 rounded-lg text-sm transition-all duration-150 cursor-pointer relative
              ${hasActiveChild || isDropdownOpen
                ? 'text-blue-600 bg-blue-50 border-l-2 border-blue-500'
                : 'hover:bg-gray-100 hover:text-gray-800'}`
            }
          >
            <Icon className="mr-3 text-sm flex-shrink-0" size={16} />
            <span className="font-medium truncate flex-1">
              {item.name}
            </span>
            
            {/* Dropdown arrow */}
            {isDropdownOpen ? (
              <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200" />
            )}
          </div>

          {/* Dropdown items */}
          {isDropdownOpen && item.dropdownItems && (
            <div className="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-2">
              {item.dropdownItems.map((dropdownItem) => {
                const DropdownIcon = dropdownItem.icon;
                return (
                  <NavLink
                    key={dropdownItem.path}
                    to={dropdownItem.path}
                    className={({ isActive }) =>
                      `flex items-center p-2 text-gray-600 rounded-md text-xs transition-all duration-150 relative
                      ${isActive
                        ? 'text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-sm'
                        : 'hover:bg-gray-100 hover:text-gray-800'}`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <div className="absolute inset-0 bg-white opacity-10 rounded-md"></div>
                        )}
                        <DropdownIcon className="mr-2 flex-shrink-0" size={14} />
                        <span className={`font-medium truncate ${isActive ? 'text-white' : 'text-inherit'}`}>
                          {dropdownItem.name}
                        </span>
                        {isActive && (
                          <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-gradient-to-b from-blue-500 to-purple-600 rounded-r-full"></div>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    // Regular menu item without dropdown
    return (
      <NavLink
        key={item.path}
        to={item.path}
        end
        className={({ isActive }) =>
          `flex items-center p-2.5 text-gray-600 rounded-lg text-sm transition-all duration-150 mb-1.5 relative
          ${isActive
            ? 'text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-md'
            : 'hover:bg-gray-100 hover:text-gray-800'}`
        }
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <>
                <div className="absolute inset-0 bg-white opacity-10 rounded-lg"></div>
                <div className="absolute top-2 right-2">
                  <Sparkles className="w-3 h-3 text-white opacity-60" />
                </div>
              </>
            )}

            <Icon className="mr-3 text-sm flex-shrink-0" size={16} />
            <span className={`font-medium truncate ${isActive ? 'text-white' : 'text-inherit'}`}>
              {item.name}
            </span>

            {isActive && (
              <ChevronRight className="ml-auto w-4 h-4 text-white opacity-80 flex-shrink-0" />
            )}

            {isActive && (
              <div className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-gradient-to-b from-blue-500 to-purple-600 rounded-r-full"></div>
            )}
          </>
        )}
      </NavLink>
    );
  };

  return (
    <div className="w-64 md:w-[18vw] min-h-screen bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 px-3 py-4 shadow-lg overflow-y-auto">
      {/* Logo/Title Section */}
      <div className="mb-6 flex justify-center">
        <h1 className="text-xl md:text-xl uppercase font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent text-center">
          kalinga dashboard
        </h1>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {menuItems.map(renderMenuItem)}
      </nav>
    </div>
  );
};

export default Sidebar;