import React from "react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet"
import Lottie from "lottie-react"
import NotFoundAnim from "@/assets/404-animation.json" // Load your Lottie JSON animation here

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>404 Not Found | Qspace Blog</title>
        <meta name="description" content="Page not found on Qspace Blog. Return to home or explore our latest posts." />
      </Helmet>

      <section className="flex flex-col items-center justify-center min-h-screen px-6 py-16 text-center bg-gradient-to-br from-[#F0F8FF] via-white to-[#e0f3ff] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        {/* Lottie animation */}
        <div className="w-full max-w-md mb-6">
          <Lottie animationData={NotFoundAnim} loop autoplay />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
          Oops! Page not found.
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="bg-[#1E90FF] hover:bg-blue-700 text-white px-6 py-2 text-lg rounded-full shadow-lg">
              Back to Home
            </Button>
          </Link>
          <Link to="/blogs">
            <Button variant="outline" className="text-lg px-6 py-2 border-gray-400 dark:border-gray-600">
              Browse Blogs
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}

export default NotFound

