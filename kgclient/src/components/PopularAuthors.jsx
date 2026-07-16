import axios from 'axios'
import React, { useEffect, useState } from 'react'
import userLogo from '../assets/user.jpg'
import { Eye, EyeOff } from 'lucide-react'

const PopularAuthors = () => {
  const [popularUser, setPopularUser] = useState([])
  const [showAuthors, setShowAuthors] = useState(true)

  const getAllUsers = async () => {
    try {
      const res = await axios.get(`https://kgserver-bjy2.onrender.com/api/v1/user/all-users`)
      if (res.data.success) {
        setPopularUser(res.data.users)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getAllUsers()
  }, [])

  const displayedUsers = popularUser?.slice(0, 8) || []
  const remaining = popularUser?.length > 8 ? popularUser.length - 8 : 0

  return (
    <section className="rounded-[0px] border border-[#ded4c7] bg-[#f4f3ee] px-4 py-4 shadow-[0_8px_30px_rgba(20,20,19,0.05)] dark:border-[#2b2623] dark:bg-[#141413]">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a847a] dark:text-[#8f857c]">
            Popular Authors
          </span>
          <p className="mt-1 text-sm text-[#5a554e] dark:text-[#b7ada4]">
            People writing and shaping the feed
          </p>
        </div>

        <button
          onClick={() => setShowAuthors(!showAuthors)}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#ded4c7] bg-white px-3 py-1.5 text-xs font-medium text-[#5a554e] transition-all hover:border-[#0866ff] hover:text-[#0866ff] dark:border-[#2b2623] dark:bg-[#1a1a18] dark:text-[#b7ada4]"
        >
          {showAuthors ? <EyeOff size={13} /> : <Eye size={13} />}
          {showAuthors ? 'Hide' : 'Show'}
        </button>
      </div>

      {showAuthors && (
        <div className="flex flex-wrap items-center gap-2">
          {displayedUsers.map((user, index) => (
            <div key={user?._id || index} className="group relative">
              <img
                src={user.photoUrl || userLogo}
                alt={`${user.firstName} ${user.lastName}`}
                className="h-10 w-10 rounded-full object-cover border-2 border-[#ded4c7] transition-all duration-200 group-hover:scale-110 group-hover:border-[#0866ff] group-hover:shadow-[0_0_0_3px_rgba(8,102,255,0.12)] dark:border-[#2b2623]"
              />

              <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 scale-95 whitespace-nowrap rounded-lg bg-[#191817] px-2.5 py-1 text-xs font-medium text-white opacity-0 transition-all duration-150 group-hover:scale-100 group-hover:opacity-100 dark:bg-[#f8f3ed] dark:text-[#191817]">
                {user.firstName} {user.lastName}
                <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[#191817] dark:border-t-[#f8f3ed]" />
              </div>
            </div>
          ))}

          {remaining > 0 && (
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-[#cfc7bc] bg-white text-xs font-semibold text-[#5a554e] transition-colors hover:border-[#0866ff] hover:text-[#0866ff] dark:border-[#4a433d] dark:bg-[#1a1a18] dark:text-[#b7ada4]">
              +{remaining}
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default PopularAuthors
