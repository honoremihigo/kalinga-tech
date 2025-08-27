import React, { useEffect, useState } from 'react';
import { Users, Shield, Menu, X, ArrowLeft } from 'lucide-react';

import { Link, NavLink, Outlet } from 'react-router-dom'
import taskService from '../../Services/Dispatch/taskService';
import employeeService from '../../Services/Dispatch/employeeService';


const UserManagementLayout = ({ children }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [task, setTask] = useState([]);

    useEffect(() => {

        const getData = async () => {
            try {

                const [
                    taskData,
                    employeeData
                ] = await Promise.all([
                    taskService.getAllTasks(),
                    employeeService.getAllEmployees()
                ])
                console.log(employeeData);
                console.log(taskData);
                setEmployees(employeeData || [])
                setTask(taskData || [])
            } catch (error) {
                console.log(error);

            }
        }

        getData()

    }, [])




    const navItems = [
        {
            name: 'Employee Management',
            path: 'employees',
            icon: Users
        },
        {
            name: 'Permission Management',
            path: 'permissions',
            icon: Shield
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation Bar */}
            <nav className="bg-white shadow-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Left side - Back button and title */}
                        <div className="flex items-center space-x-4">

                           
                            <h1 className="text-xl font-bold text-gray-800">User Management</h1>
                        </div>

                        {/* Desktop Navigation Links */}
                        <div className="hidden md:block">
                            <div className="flex items-center space-x-1">
                                {navItems.map((item) => {
                                    const IconComponent = item.icon;
                                    return (
                                        <Link
                                            key={item.name}
                                            to={item.path}
                                            className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                                            activeClassName="text-blue-600 bg-blue-50"
                                        >
                                            <IconComponent className="w-4 h-4 mr-2" />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                type="button"
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? (
                                    <X className="block h-5 w-5" />
                                ) : (
                                    <Menu className="block h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                <div className={`md:hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                    <div className="px-4 pt-2 pb-4 space-y-1 bg-gray-50 border-t border-gray-200">
                        {navItems.map((item) => {
                            const IconComponent = item.icon;
                            return (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    className="flex items-center px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 w-full"
                                    activeClassName="text-blue-600 bg-blue-50"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <IconComponent className="w-5 h-5 mr-3" />
                                    {item.name}
                                </NavLink>
                            );
                        })}
                    </div>
                </div>
            </nav>

          

            {/* Main Content Area */}
            <Outlet />
        </div>
    );
};

export default UserManagementLayout;