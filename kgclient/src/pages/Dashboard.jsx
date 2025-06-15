import Sidebar from '@/components/Sidebar'
import React from 'react'
import { Outlet } from 'react-router-dom'
import {Helmet} from 'react-helmet';
const Dashboard = () => {
    return (
<>
        <Helmet>
        <title>Dashboard | Qspace</title>
        <meta name="description" content="Read our latest tech, coding, and career articles." />
      </Helmet>
        <div className=' flex'>
            <Sidebar />
            <div className='flex-1'>
                <Outlet />
            </div>
        </div>
</>
    )
}

export default Dashboard
