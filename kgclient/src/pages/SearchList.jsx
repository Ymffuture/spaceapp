import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import BlogCard from '@/components/BlogCard';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import Lottie from 'lottie-react';
import NotFoundAnim from '@/assets/searchAnimation.json'; // Your animation file

const SearchList = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get('q');
  const { blog } = useSelector(store => store.blog);

  const filteredBlogs = blog.filter(
    (blog) =>
      blog.title.toLowerCase().includes(query?.toLowerCase()) ||
      blog.subtitle.toLowerCase().includes(query?.toLowerCase()) ||
      blog.category.toLowerCase() === query?.toLowerCase()
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Search results - {query} | Qspace</title>
        <meta name="description" content="Search latest tech, coding, and career articles." />
      </Helmet>

      <div className="pt-28 pb-16 px-4 min-h-screen bg-gradient-to-b from-[#f0f8ff] via-white to-[#e8f5e9] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Search Results for: <span className="text-blue-600 dark:text-green-400">"{query}"</span>
          </motion.h2>

          {filteredBlogs.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.15,
                  },
                },
              }}
            >
              {filteredBlogs.map((blog, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <BlogCard blog={blog} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center mt-20 text-center">
              <Lottie animationData={NotFoundAnim} loop autoplay className="w-72 h-72" />
              <p className="text-lg font-medium text-gray-600 dark:text-gray-300 mt-4">
                No blogs found matching <span className="text-blue-500 dark:text-green-400">"{query}"</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchList;

