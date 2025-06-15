import Hero from '@/components/Hero'
import React from 'react'
import RecentBlog from '@/components/RecentBlog'
import PopularAuthors from '@/components/PopularAuthors'
import {Helmet} from 'react-helmet' 
const Home = () => {
  return (
    <>
    <Helmet>
        <title>Home | Qspace</title>
        <meta name="description" content="Read our latest tech, coding, and career articles." />
      </Helmet>
    
    <div className='pt-20'>
      <Hero/>
      <RecentBlog/>
      <PopularAuthors/>
    </div>
    </>
  )
}

export default Home
