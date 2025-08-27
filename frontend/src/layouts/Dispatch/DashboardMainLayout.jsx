import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/Dispatch/dashboard/Sidebar'
import Header from '../../components/Dispatch/dashboard/Header'

function DashboardMainLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    // Check if screen is mobile size
    useEffect(() => {
        const checkScreenSize = () => {
            const mobile = window.innerWidth < 1268
            setIsMobile(mobile)
            
            // Auto-close sidebar on mobile when screen resizes
            if (mobile) {
                setIsSidebarOpen(false)
            } else {
                // Auto-open sidebar on desktop
                setIsSidebarOpen(true)
            }
        }

        checkScreenSize()
        window.addEventListener('resize', checkScreenSize)
        return () => window.removeEventListener('resize', checkScreenSize)
    }, [])

    // Close sidebar when clicking outside on mobile
    const handleOverlayClick = () => {
        if (isMobile) {
            setIsSidebarOpen(false)
        }
    }

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Mobile Overlay */}
            {isMobile && isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={handleOverlayClick}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                ${isMobile 
                    ? `fixed left-0 top-0 h-full z-50 transform transition-transform duration-300 ease-in-out ${
                        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`
                    : `${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`
                }
               flex-shrink-0
               h-[695px]
            `}>
                <Sidebar />
            </aside>

            {/* Main Content Area */}
            <div className={`
                flex-1 flex flex-col  overflow-auto transition-all duration-300 ease-in-out
              
            `}>
                {/* Header */}
                <Header 
                    toggleSidebar={toggleSidebar}
                    isSidebarOpen={isSidebarOpen}
                    isMobile={isMobile}
                />
                
                {/* Main Content */}
                <main className="flex-1 p-4 md:p-6 lg:p-8 max-h-[90vh] overflow-y-auto  bg-gray-100 overflow-auto">
                    <div className="max-w-full mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}

export default DashboardMainLayout