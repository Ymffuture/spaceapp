import React from 'react'
import heroImg from "../assets/blog.jpg"
import { Button } from './ui/button'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <section className="w-full bg-gradient-to-br from-[#F0F8FF] via-white to-[#e0f3ff] dark:from-[#1f2937] dark:to-[#111827] py-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-10">
        
        {/* Left Text Content */}
        <div className="max-w-xl text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-gray-800 dark:text-white">
            Explore the Latest <span className="text-[#1E90FF]">Tech</span> & <span className="text-[#FFD700]">Web Trends</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-300">
            Stay ahead with in-depth articles, tutorials, and insights on web development, digital marketing, and tech innovations.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
            <Link to="/dashboard/write-blog">
              <Button className="px-8 py-3 text-lg font-medium bg-[#32CD32] hover:bg-green-600 transition-all duration-200 shadow-md">
                Get Started
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" className="px-8 py-3 text-lg border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800">
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Image Content */}
        <div className="flex justify-center">
          <img
            src={heroImg}
            alt="Hero Blog Banner"
            className="w-[90%] max-w-md md:max-w-lg rounded-2xl shadow-2xl"
          />
        </div>
      </div>
    </section>
  )
}

export default Hero
