import { User, LogOut, Menu, X } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import Logo from '../../assets/images/abyride-logo.png';
import AuthService from '../../Services/ClientProcess/Auth';

const Header = () => {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AuthService.getProfile();
        setUser(userData?.client);
      } catch (error) {
        console.error('Error fetching client data:', error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUsername = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    return parts.map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      navigate('/AbyrideClient');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-[#293751] border-b border-gray-600 sticky top-0 z-50">
      <div className="flex justify-between items-center p-2">
        <div className="flex items-center">
          <img 
            src={Logo} 
            alt="AbyRide Logo" 
            className="h-16 w-auto cursor-pointer"
            onClick={() => navigate('/clientdashboard')}
          />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-10 text-sm font-medium">
          <NavLink to="/clientdashboard" end className={({ isActive }) =>
            `transition-colors duration-200 ${isActive ? 'text-blue-400 font-semibold' : 'text-white hover:text-blue-300'}`
          }>
            Home
          </NavLink>
          <NavLink to="/client/wallet" className={({ isActive }) =>
            `transition-colors duration-200 ${isActive ? 'text-blue-400 font-semibold' : 'text-white hover:text-blue-300'}`
          }>
            Wallet
          </NavLink>
          <NavLink to="/client/activity" className={({ isActive }) =>
            `transition-colors duration-200 ${isActive ? 'text-blue-400 font-semibold' : 'text-white hover:text-blue-300'}`
          }>
            Activity
          </NavLink>
          <NavLink to="/client/promotion" className={({ isActive }) =>
            `transition-colors duration-200 ${isActive ? 'text-blue-400 font-semibold' : 'text-white hover:text-blue-300'}`
          }>
            Promotion
          </NavLink>
          <NavLink to="/client/support" className={({ isActive }) =>
            `transition-colors duration-200 ${isActive ? 'text-blue-400 font-semibold' : 'text-white hover:text-blue-300'}`
          }>
            Support
          </NavLink>
        </nav>

        {/* Profile & Mobile */}
        <div className="flex items-center space-x-4">
          <div className="relative" ref={dropdownRef}>
            <div
              className="w-10 h-10 bg-blue-500 cursor-pointer rounded-full flex items-center justify-center overflow-hidden"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="text-white font-semibold">
                {handleUsername(`${user?.firstName} ${user?.lastName}`)}
              </span>
            </div>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                <div className="py-2">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      Hello, {user?.firstName || 'Client'}!
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email || 'client@example.com'}
                    </p>
                  </div>
                  <NavLink to="clientprofile" className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <User className="w-4 h-4 mr-3" />
                    Profile
                  </NavLink>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            className="md:hidden text-white hover:text-blue-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#293751] border-t border-gray-600">
          <nav className="flex flex-col space-y-1 p-4 text-white">
            <NavLink to="/clientdashboard" onClick={closeMobileMenu}>Home</NavLink>
            <NavLink to="/client/wallet" onClick={closeMobileMenu}>Wallet</NavLink>
            <NavLink to="/client/activity" onClick={closeMobileMenu}>Activity</NavLink>
            <NavLink to="/client/promotion" onClick={closeMobileMenu}>Promotion</NavLink>
            <NavLink to="/client/support" onClick={closeMobileMenu}>Support</NavLink>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
