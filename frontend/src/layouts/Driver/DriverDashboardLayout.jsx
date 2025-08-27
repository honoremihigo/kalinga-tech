import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../../components/driver/Header'

function DriverDashboardLayout() {
  return (
    <div>
       <Header />
        <Outlet />
    </div>
  )
}

export default DriverDashboardLayout