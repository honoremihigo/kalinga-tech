import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../../components/clients/Header'

function ClientDashboardLayout() {
  return (
    <div>
       <Header />
        <Outlet />
    </div>
  )
}

export default ClientDashboardLayout