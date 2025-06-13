import React from 'react'
import Signup from './pages/Signup'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import Profile from './pages/Profile'
import Blog from './pages/Blog'
import CreateBlog from './pages/CreateBlog'
import Dashboard from './pages/Dashboard'
import YourBlog from './pages/YourBlog'
import BlogView from './pages/BlogView'
import Footer from './components/Footer'
import About from './pages/About'
import Comments from './pages/Comments'
import UpdateBlog from './pages/UpdateBlog'
import ProtectedRoute from './components/ProtectedRoute'
import SearchList from './pages/SearchList'
import "react-tooltip/dist/react-tooltip.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <><Navbar/><Home /><Footer/></>
  },
  {
    path: "/blogs",
    element: <><Navbar/><Blog /><Footer/></>
  },
  {
    path: "/about",
    element: <><Navbar/><About /><Footer/></>
  },
  {
    path: "/search",
    element: <><Navbar/><SearchList/><Footer/></>
  },
  {
    path: "/blogs/:blogId",
    element: <><Navbar/><ProtectedRoute><BlogView /></ProtectedRoute></>
  },
  {
    path: "/write-blog",
    element: <><Navbar/><CreateBlog /></>
  },
 
  {
    path: "/profile",
    element: <><Navbar/><Profile /></>
  },
  // {
  //   path: "write-blog/:blogId",
  //       element: <><Navbar/><CreateBlog /></>
  // },
  // {
  //   path: "/dashboard",
  //   element: <><Navbar/><Dashboard /></>
  // },
  {
    path:"/dashboard",
    element: <><Navbar/><ProtectedRoute><Dashboard/></ProtectedRoute></>,
    children:[
      {
        path: "write-blog",
        element:<><CreateBlog/></>
      },
      {
        path: "write-blog/:blogId",
        element: <><UpdateBlog /></>
      },
      {
        path: "your-blog",
        element:<YourBlog/>
      },
      {
        path: "comments",
        element:<Comments/>
      },
      {
        path: "profile",
        element:<Profile/>
      },
      
      
    ]
   },
  {
    path: "/signup",
    element: <><Navbar/><Signup /></> 
  },
  {
    path: "/login",
    element: <><Navbar/><Login /></>
  },
])

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F8FF] to-white dark:from-[#111827] dark:to-[#1f2937]">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
