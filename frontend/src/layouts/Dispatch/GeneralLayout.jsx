import React, { useState } from 'react';
import { Users, User, Home, Search, Menu, X } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

export const navItems = [
  {
    name: 'User Management',
    path: '/Dispatch/dashboard/general/user-management',
    icon: Users
  },
  {
    name: 'Customer',
    path: '/Dispatch/dashboard/general/customer',
    icon: User
  },
  {
    name: 'Found Property',
    path: '/Dispatch/dashboard/general/found-property',
    icon: Home
  },
  // {
  //   name: 'Lost Property',
  //   path: '/Dispatch/dashboard/general/lost-property',
  //   icon: Search
  // }
];


const GeneralLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-[85vh] overscroll-y-auto bg-gray-50">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 bg-white border-r border-gray-200 shadow-sm">
          {/* Logo/Brand */}
          <div className="flex items-center flex-shrink-0 px-4 mb-6">
            <h1 className="text-xl font-bold text-gray-800">Property Management</h1>
          </div>
          
          {/* Navigation */}
          <div className="flex-1 flex flex-col">
            <nav className="flex-1 px-3 pb-4 space-y-1">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                      `group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        isActive
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <IconComponent 
                          className={`w-5 h-5 mr-3 ${
                            isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'
                          }`} 
                        />
                        {item.name}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity duration-300 ease-linear ${
            sidebarOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setSidebarOpen(false)}
        />
        
        {/* Sidebar */}
        <div
          className={`relative flex-1 flex flex-col max-w-xs w-full bg-white transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            {/* Logo/Brand */}
            <div className="flex items-center flex-shrink-0 px-4 mb-6">
              <h1 className="text-xl font-bold text-gray-800">Property Management</h1>
            </div>
            
            {/* Navigation */}
            <nav className="mt-5 px-3 space-y-1">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                      `group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        isActive
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                      }`
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    {({ isActive }) => (
                      <>
                        <IconComponent 
                          className={`w-5 h-5 mr-3 ${
                            isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'
                          }`} 
                        />
                        {item.name}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar for mobile */}
        <div className="md:hidden">
          <div className="flex items-center justify-between h-16 bg-white border-b border-gray-200 shadow-sm px-4">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-800">Property Management</h1>
            <div className="w-6 h-6" /> {/* Spacer for centering */}
          </div>
        </div>

        {/* Page content */}
        <Outlet />
      </div>
    </div>
  );
};

export default GeneralLayout;