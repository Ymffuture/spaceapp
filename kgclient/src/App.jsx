import React, { Suspense, lazy } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import AnimatedVisionLogo from './components/AnimatedVisionLogo' // Custom loader
import NotFound from './pages/NotFound';
// Lazy load pages
const Home = lazy(() => import('./pages/Home'))
const Blog = lazy(() => import('./pages/Blog'))
const About = lazy(() => import('./pages/About'))
const SearchList = lazy(() => import('./pages/SearchList'))
const BlogView = lazy(() => import('./pages/BlogView'))
const CreateBlog = lazy(() => import('./pages/CreateBlog'))
const UpdateBlog = lazy(() => import('./pages/UpdateBlog'))
const Profile = lazy(() => import('./pages/Profile'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const YourBlog = lazy(() => import('./pages/YourBlog'))
const Comments = lazy(() => import('./pages/Comments'))
const Signup = lazy(() => import('./pages/Signup'))
const Login = lazy(() => import('./pages/Login'))
const Terms = lazy(()=>import('./pages/Terms' ))
const PrivacyPolicy = lazy(()=>import('./pages/PrivacyPolicy')) 
// Main router
const router = createBrowserRouter([
  {
    path: "/",
    element: <><Navbar /><Home /><Footer /></>
  },
  {
    path: "/blogs",
    element: <><Navbar /><Blog /><Footer /></>
  },
  {
    path: "/about",
    element: <><Navbar /><About /><Footer /></>
  },
    {
    path: "/terms",
    element: <><Navbar /><Terms /></>
  },
    {
    path: "/privacy",
    element: <><Navbar /><PrivacyPolicy /></>
  },
  {
    path: "/*",
    element: <><NotFound /></>
  },
  
  {
    path: "/search",
    element: <><Navbar /><SearchList /><Footer/></>
  },
  {
    path: "/blogs/:blogId",
    element: <><Navbar /><ProtectedRoute><BlogView /></ProtectedRoute></>
  },
  {
    path: "/write-blog",
    element: <><Navbar /><CreateBlog /></>
  },
  {
    path: "/profile",
    element: <><Navbar /><Profile /></>
  },
  {
    path: "/dashboard",
    element: <><Navbar /><ProtectedRoute><Dashboard /></ProtectedRoute></>,
    children: [
      {
        path: "write-blog",
        element: <CreateBlog />
      },
      {
        path: "write-blog/:blogId",
        element: <UpdateBlog />
      },
      {
        path: "your-blog",
        element: <YourBlog />
      },
      {
        path: "comments",
        element: <Comments />
      },
      {
        path: "profile",
        element: <Profile />
      },
    ]
  },
  {
    path: "/signup",
    element: <><Navbar /><Signup /></>
  },
  {
    path: "/login",
    element: <><Navbar /><Login /></>
  }
])

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F8FF] to-white dark:from-[#111827] dark:to-[#1f2937]">
      <Suspense fallback={
        <div className="min-h-screen flex justify-center items-center bg-white dark:bg-black">
          <AnimatedVisionLogo />
        </div>
      }>
        <RouterProvider router={router} />
      </Suspense>
    </div>
  )
}

export default App

