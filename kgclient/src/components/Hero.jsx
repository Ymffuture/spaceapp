import React,{useEffect} from 'react'
import heroImg from "../assets/blog.jpg"
import { Button } from './ui/button'
import { Link } from 'react-router-dom'

const Hero = () => {

useEffect(() => {
    document.title = "Home | Qspace-Blog"
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", "Learn more about Qspace, our mission, values, and team.")
  }, [])

  return (
    <section
      className="w-full bg-cover bg-center bg-no-repeat py-20 px-4 md:px-6 relative"
      style={{
        backgroundImage: `url(${heroImg})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F0F8FF]/80 via-white/70 to-[#e0f3ff]/90 dark:from-[#1f2937]/90 dark:to-[#111827]/90 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center md:items-start text-center md:text-left">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-gray-900 dark:text-white drop-shadow-lg">
          Explore the Latest <span className="text-[#1E90FF]">Tech</span> & <span className="text-[#FFD700]">Web Trends</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl drop-shadow-sm">
          Stay ahead with in-depth articles, tutorials, and insights on web development, digital marketing, and tech innovations.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link to="/dashboard/write-blog">
            <Button className="px-8 py-3 text-lg font-semibold bg-[#32CD32] hover:bg-green-600 shadow-xl">
              Get Started
            </Button>
          </Link>
          <Link to="/about">
            <Button
              variant="outline"
              className="px-8 py-3 text-lg border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Hero
