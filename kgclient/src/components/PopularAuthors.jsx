import axios from 'axios';
import React, { useEffect, useState } from 'react';
import userLogo from '../assets/user.jpg';
import { Sparkles, Send, Eye, EyeOff } from 'lucide-react';

const PopularAuthors = () => {
  const [popularUser, setPopularUser] = useState([]);
  const [showAuthors, setShowAuthors] = useState(false);

  const getAllUsers = async () => {
    try {
      const res = await axios.get(`http://localhost:9123/api/v1/user/all-users`);
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

  return (
    <section className="bg-white dark:bg-gray-900 px-4 py-8 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Sparkles className="text-[#1E90FF]" />
          Popular Authors
        </h2>
        <button
          onClick={() => setShowAuthors(!showAuthors)}
          className="text-sm text-[#1E90FF] hover:text-blue-700 flex items-center gap-1"
        >
          {showAuthors ? <EyeOff size={18} /> : <Eye size={18} />}
          {showAuthors ? 'Hide' : 'Show'}
        </button>
      </div>

      {showAuthors && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 transition-all">
          {popularUser?.slice(0, 6).map((user, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-blue-600 to-green-500 p-[1px] rounded-lg hover:scale-105 transition-all"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-md">
                <img
                  src={user.photoUrl || userLogo}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover mx-auto border-2 border-[#FFD700]"
                />
                <h4 className="mt-2 text-sm font-semibold text-gray-800 dark:text-white truncate">
                  {user.firstName} {user.lastName}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">@{user.username || 'quorvex_author'}</p>
                <button className="mt-2 w-full bg-[#1E90FF] text-white py-1 rounded-full text-xs hover:bg-blue-700 transition">
                  Follow
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default PopularAuthors;
