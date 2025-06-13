import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { setBlog } from '@/redux/blogSlice';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Select from 'react-select';

const CreateBlog = () => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(null);
  const { blog } = useSelector((store) => store.blog);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const tags = [
    'Blogging', 'Web Development', 'Digital Marketing', 'Cooking',
    'Photography', 'Sports', 'Science', 'Finance',
    'Education', 'Health & Wellness', 'Technology', 'Art & Design',
  ];

  const tagOptions = tags.map((tag) => ({
    value: tag,
    label: tag,
  }));

  const createBlogHandler = async () => {
    if (!title || !category) return toast.error("Please enter title and select category");
    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:9123/api/v1/blog/`,
        { title, category: category.value },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setBlog([...blog, res.data.blog]));
        navigate(`/dashboard/write-blog/${res.data.blog._id}`);
        toast.success(res.data.message);
      } else {
        toast.error('Something went wrong');
      }
    } catch (error) {
      console.log(error);
      toast.error("Error creating blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen w-full md:ml-[320px] pt-20 p-4 bg-gradient-to-br from-[#f0f8ff] to-[#ffffff] dark:from-gray-900 dark:to-gray-800 transition-all'>
      <Card className='glass-card md:p-10 p-5 backdrop-blur-lg bg-white/50 dark:bg-gray-800/70 shadow-xl rounded-2xl border border-slate-200 dark:border-gray-700 max-w-2xl mx-auto'>
        <h1 className='text-3xl font-bold mb-2 text-blue-700 dark:text-blue-400'>Create a New Blog</h1>
        <p className='text-gray-600 dark:text-gray-300 mb-6'>
          Start sharing your thoughts, stories, or tutorials with the world.
        </p>

        <div className='space-y-6'>
          <div>
            <Label className="text-gray-800 dark:text-white">Title</Label>
            <Input
              type='text'
              placeholder='e.g. My Journey into React'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='bg-white dark:bg-gray-700 dark:text-white mt-2'
            />
          </div>

          <div>
            <Label className="text-gray-800 dark:text-white">Category</Label>
            <Select
              options={tagOptions}
              onChange={setCategory}
              className="mt-2 text-black"
              classNamePrefix='react-select'
              placeholder='Search & select category'
              styles={{
                control: (base) => ({
                  ...base,
                  background: '#ffffff',
                  borderColor: '#cbd5e0',
                  borderRadius: '0.5rem',
                  padding: '2px',
                }),
                menu: (base) => ({
                  ...base,
                  zIndex: 9999,
                }),
              }}
              theme={(theme) => ({
                ...theme,
                borderRadius: 6,
                colors: {
                  ...theme.colors,
                  primary25: '#e0f2fe',
                  primary: '#1e90ff',
                },
              })}
            />
          </div>

          <div className='pt-4'>
            <Button
              disabled={loading}
              onClick={createBlogHandler}
              className='w-full md:w-auto flex items-center gap-2'
            >
              {loading ? (
                <>
                  <Loader2 className='mr-1 h-4 w-4 animate-spin' />
                  Please wait...
                </>
              ) : (
                'Create Blog'
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CreateBlog;
