import React from 'react'
import { Outlet } from 'react-router-dom'

function DashboardLayout() {
  return (
    <div className='overflow-hidden'>
        <Outlet />
    </div>
  )
}

export default DashboardLayout