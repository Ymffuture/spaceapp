import React, { Suspense, lazy } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import AnimatedVisionLogo from './components/AnimatedVisionLogo' // Custom loader
import NotFound from './pages/NotFound';
import ErrorPage from './pages/ErrorPage';
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
    element: <><Navbar /><Home /><Footer /></>,
    errorElement: <ErrorPage />
  },
  {
    path: "/blogs",
    element: <><Navbar /><Blog /><Footer /></>,
    errorElement: <ErrorPage />
  },
  {
    path: "/about",
    element: <><Navbar /><About /><Footer /></>,
    errorElement: <ErrorPage />
  },
  {
    path: "/terms",
    element: <><Navbar /><Terms /></>,
    errorElement: <ErrorPage />
  },
  {
    path: "/privacy",
    element: <><Navbar /><PrivacyPolicy /></>,
    errorElement: <ErrorPage />
  },
  {
    path: "/*",
    element: <><NotFound /></>,
    errorElement: <ErrorPage />
  },
  {
    path: "/search",
    element: <><Navbar /><SearchList /><Footer/></>, 
    errorElement: <ErrorPage />
  },
  {
    path: "/blogs/:blogId",
    element: <><Navbar /><BlogView /></>, 
    errorElement: <ErrorPage />
  },
  {
    path: "/write-blog",
    element: <><Navbar /><CreateBlog /></>,
    errorElement: <ErrorPage />
  },
  {
    path: "/profile",
    element: <><Navbar /><Profile /></>,
    errorElement: <ErrorPage />
  },
  {
    path: "/dashboard",
    element: <><Navbar /><ProtectedRoute><Dashboard /></ProtectedRoute></>,
    errorElement: <ErrorPage />,
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
    element: <><Navbar /><Signup /></>,
    errorElement: <ErrorPage />
  },
  {
    path: "/login",
    element: <><Navbar /><Login /></>,
    errorElement: <ErrorPage />
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
