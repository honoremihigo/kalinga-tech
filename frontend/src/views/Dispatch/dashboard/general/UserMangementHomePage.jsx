import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';
import employeeService from '../../../../Services/Dispatch/employeeService';
import taskService from '../../../../Services/Dispatch/taskService';
import { Shield, Users } from 'lucide-react';

const UserMangementHomePage = () => {
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
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">

            <div className="space-y-6">
                {/* Welcome Card */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">User Management Dashboard</h2>
                    <p className="text-gray-600 mb-6">
                        Manage your organization's users, employees, and permissions from this central hub.
                    </p>

                    {/* Quick Action Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {navItems.map((item) => {
                            const IconComponent = item.icon;
                            return (
                                <div key={item.name} className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                                    <div className="flex items-center mb-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <IconComponent className="w-5 h-5 text-blue-600" />
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mb-4">
                                        {item.name === 'Employee Management' && 'Add, edit, and manage employee accounts, profiles, and organizational structure.'}
                                        {item.name === 'Permission Management' && 'Configure user roles, access levels, and system permissions across the platform.'}
                                    </p>
                                    <NavLink
                                        to={item.path}
                                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                                    >
                                        Manage {item.name.split(' ')[0]}s
                                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </NavLink>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Users className="w-8 h-8 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Employees</p>
                                <p className="text-2xl font-semibold text-gray-900">{employees.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Shield className="w-8 h-8 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Permission</p>
                                <p className="text-2xl font-semibold text-gray-900">{task.length}</p>
                            </div>
                        </div>
                    </div>


                </div>
            </div>

        </main>
    )
}

export default UserMangementHomePage