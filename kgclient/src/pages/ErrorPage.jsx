import React from "react"
import { Button } from "@/components/ui/button"
import { Link, useRouteError, isRouteErrorResponse, useNavigate } from "react-router-dom"
import { Helmet } from "react-helmet"
import Lottie from "lottie-react"
import { RefreshCw, Home, Newspaper } from "lucide-react"
import NotFoundAnim from "@/assets/404-animation.json"

const ErrorPage = () => {
  const error = useRouteError()
  const navigate = useNavigate()

  const is404 = isRouteErrorResponse(error) && error.status === 404

  const title = is404
    ? "Oops! Page not found."
    : "Something went wrong."

  const description = is404
    ? "The page you're looking for doesn't exist or has been moved."
    : "This page hit an unexpected error. It's not you — try reloading, or head back home."

  const errorDetail =
    !is404 && import.meta.env.DEV
      ? error?.message || String(error)
      : null

  return (
    <>
      <Helmet>
        <title>{is404 ? "404 Not Found" : "Something went wrong"} | Qspace Blog</title>
        <meta name="description" content={description} />
      </Helmet>

      <section className="flex flex-col items-center justify-center min-h-screen px-6 py-16 text-center bg-gradient-to-br from-[#F0F8FF] via-white to-[#e0f3ff] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="w-full max-w-md mb-6">
          <Lottie animationData={NotFoundAnim} loop autoplay />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
          {title}
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-2 text-lg max-w-md">
          {description}
        </p>

        {errorDetail && (
          <pre className="text-xs text-red-500/80 bg-red-50 dark:bg-red-950/30 rounded-lg px-4 py-2 mb-4 max-w-lg overflow-auto text-left">
            {errorDetail}
          </pre>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
          {!is404 && (
            <Button
              onClick={() => navigate(0)}
              className="bg-[#1E90FF] hover:bg-blue-700 text-white px-6 py-2 text-lg rounded-full shadow-lg flex items-center gap-2"
            >
              <RefreshCw size={18} />
              Try again
            </Button>
          )}
          <Link to="/">
            <Button
              variant={is404 ? "default" : "outline"}
              className={
                is404
                  ? "bg-[#1E90FF] hover:bg-blue-700 text-white px-6 py-2 text-lg rounded-full shadow-lg flex items-center gap-2"
                  : "text-lg px-6 py-2 border-gray-400 dark:border-gray-600 flex items-center gap-2"
              }
            >
              <Home size={18} />
              Back to Home
            </Button>
          </Link>
          <Link to="/blogs">
            <Button
              variant="outline"
              className="text-lg px-6 py-2 border-gray-400 dark:border-gray-600 flex items-center gap-2"
            >
              <Newspaper size={18} />
              Browse Blogs
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}

export default ErrorPage
