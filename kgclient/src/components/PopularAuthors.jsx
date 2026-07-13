import axios from 'axios';
import React, { useEffect, useState } from 'react';
import userLogo from '../assets/user.jpg';
import { Eye, EyeOff } from 'lucide-react';

const PopularAuthors = () => {
  const [popularUser, setPopularUser] = useState([]);
  const [showAuthors, setShowAuthors] = useState(true);

  const getAllUsers = async () => {
    try {
      const res = await axios.get(`https://kgserver-bjy2.onrender.com/api/v1/user/all-users`);
      if (res.data.success) {
        setPopularUser(res.data.users);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const displayedUsers = popularUser?.slice(0, 8) || [];
  const remaining = popularUser?.length > 8 ? popularUser.length - 8 : 0;

  return (
    <section className="px-4 py-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
          Popular Authors
        </span>
        <button
          onClick={() => setShowAuthors(!showAuthors)}
          className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:text-zinc-500 dark:hover:text-zinc-300 dark:hover:bg-zinc-800 transition-all"
        >
          {showAuthors ? <EyeOff size={13} /> : <Eye size={13} />}
          {showAuthors ? 'Hide' : 'Show'}
        </button>
      </div>

      {/* Avatars Row */}
      {showAuthors && (
        <div className="flex items-center flex-wrap gap-1.5">
          {displayedUsers.map((user, index) => (
            <div key={index} className="group relative">
              <img
                src={user.photoUrl || userLogo}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-9 h-9 rounded-full object-cover border-2 border-gray-200 dark:border-zinc-700 cursor-pointer transition-all duration-200 group-hover:border-blue-500 group-hover:scale-110 group-hover:shadow-[0_0_0_3px_rgba(37,99,235,0.15)]"
              />
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-gray-900 dark:bg-zinc-800 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 whitespace-nowrap z-50 scale-95 group-hover:scale-100">
                {user.firstName} {user.lastName}
                <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-zinc-800" />
              </div>
            </div>
          ))}
          {remaining > 0 && (
            <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-zinc-800 border-2 border-dashed border-gray-300 dark:border-zinc-600 flex items-center justify-center text-xs font-semibold text-gray-500 dark:text-zinc-400 cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all">
              +{remaining}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default PopularAuthors;
