import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { setBlog } from '@/redux/blogSlice';
import axios from 'axios';
import { Loader2, Sparkles, PenLine, ArrowRight, CheckCircle2, BookOpen } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Select from 'react-select';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';

const CreateBlog = () => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(null);
  const [subtitle, setSubtitle] = useState('');
  const [step, setStep] = useState(1);
  const { blog } = useSelector((store) => store.blog);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Character count for title
  const titleChars = title.length;
  const maxTitleChars = 100;

  const categories = [
    { value: 'Technology', label: 'Technology', icon: '💻', color: '#3b82f6' },
    { value: 'Web Development', label: 'Web Development', icon: '🌐', color: '#10b981' },
    { value: 'Digital Marketing', label: 'Digital Marketing', icon: '📈', color: '#f59e0b' },
    { value: 'Cooking', label: 'Cooking', icon: '👨‍🍳', color: '#ef4444' },
    { value: 'Photography', label: 'Photography', icon: '📸', color: '#8b5cf6' },
    { value: 'Sports', label: 'Sports', icon: '⚽', color: '#06b6d4' },
    { value: 'Science', label: 'Science', icon: '🔬', color: '#6366f1' },
    { value: 'Finance', label: 'Finance', icon: '💰', color: '#84cc16' },
    { value: 'Education', label: 'Education', icon: '🎓', color: '#ec4899' },
    { value: 'Health & Wellness', label: 'Health & Wellness', icon: '🧘', color: '#14b8a6' },
    { value: 'Art & Design', label: 'Art & Design', icon: '🎨', color: '#f97316' },
    { value: 'Blogging', label: 'Blogging', icon: '✍️', color: '#64748b' },
    { value: 'Other', label: 'Other', icon: '📌', color: '#71717a' },
  ];

  const createBlogHandler = async () => {
    if (!title.trim() || !category) {
      return toast.error("Please enter a title and select a category");
    }

    try {
      setLoading(true);

      const payload = {
        title: title.trim(),
        subtitle: subtitle.trim(),
        category: category?.value,
      };

      const res = await axios.post(
        "https://kgserver-bjy2.onrender.com/api/v1/blog",
        payload,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data?.success && res.data?.blog) {
        dispatch(setBlog([...(blog || []), res.data.blog]));
        toast.success(res.data?.message || "Blog created successfully!");
        navigate(`/dashboard/write-blog/${res.data.blog._id}`);
      } else {
        toast.error(res.data?.message || "Failed to create blog");
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      toast.error(
        error.response?.data?.message || "Server error while creating blog"
      );
    } finally {
      setLoading(false);
    }
  };

  // Auto-advance step when title is entered
  useEffect(() => {
    if (title.trim().length > 3 && step === 1) {
      setStep(2);
    }
  }, [title]);

  // Custom Select styles
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      background: 'transparent',
      borderColor: state.isFocused ? '#3b82f6' : '#e5e7eb',
      borderWidth: '2px',
      borderRadius: '16px',
      padding: '8px 4px',
      boxShadow: state.isFocused ? '0 0 0 4px rgba(59, 130, 246, 0.1)' : 'none',
      transition: 'all 0.2s',
      '&:hover': {
        borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
      },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected 
        ? '#eff6ff' 
        : state.isFocused 
          ? '#f3f4f6' 
          : 'transparent',
      color: state.isSelected ? '#2563eb' : '#374151',
      padding: '12px 16px',
      cursor: 'pointer',
      borderRadius: '12px',
      margin: '2px 8px',
      width: 'calc(100% - 16px)',
    }),
    menu: (base) => ({
      ...base,
      borderRadius: '20px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
      padding: '8px 0',
      zIndex: 100,
    }),
    menuList: (base) => ({
      ...base,
      padding: '4px 0',
      borderRadius: '20px',
    }),
    placeholder: (base) => ({
      ...base,
      color: '#9ca3af',
      fontSize: '16px',
    }),
    singleValue: (base) => ({
      ...base,
      color: '#1f2937',
      fontSize: '16px',
      fontWeight: 500,
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: '#9ca3af',
      '&:hover': { color: '#6b7280' },
    }),
  };

  const selectTheme = (theme) => ({
    ...theme,
    borderRadius: 16,
    colors: {
      ...theme.colors,
      primary25: '#eff6ff',
      primary: '#3b82f6',
      neutral0: '#ffffff',
      neutral10: '#f3f4f6',
      neutral20: '#e5e7eb',
      neutral30: '#d1d5db',
      neutral80: '#1f2937',
    },
  });

  // Category card component
  const CategoryCard = ({ cat, isSelected, onClick }) => (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        setCategory(cat);
        setStep(3);
      }}
      className={`relative p-4 rounded-2xl border-2 transition-all text-left group
        ${isSelected 
          ? 'border-blue-500 bg-blue-50/50 shadow-md shadow-blue-500/10' 
          : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-lg'
        }`}
    >
      <div className="text-3xl mb-2">{cat.icon}</div>
      <p className={`text-sm font-semibold ${isSelected ? 'text-blue-600' : 'text-gray-700'}`}>
        {cat.label}
      </p>
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
        >
          <CheckCircle2 size={12} className="text-white" />
        </motion.div>
      )}
    </motion.button>
  );

  return (
    <>
      <Helmet>
        <title>Create Blog | Qspace</title>
        <meta name="description" content="Start writing your next great article on Qspace." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white dark:from-[#0a0a0a] dark:to-[#0f0f0f]">
        
        {/* ─── Header ─────────────────────────────────────────── */}
        <div className="border-b border-gray-100 dark:border-zinc-800/50 bg-white/50 dark:bg-[#0a0a0a]/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
                <PenLine size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-gray-900 dark:text-white">Create Blog</h1>
                <p className="text-xs text-gray-400">Step {step} of 3</p>
              </div>
            </div>
            
            {/* Progress Steps */}
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                    ${step >= s 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25' 
                      : 'bg-gray-100 text-gray-400 dark:bg-zinc-800 dark:text-zinc-600'
                    }`}>
                    {step > s ? <CheckCircle2 size={14} /> : s}
                  </div>
                  {s < 3 && (
                    <div className={`w-8 h-0.5 rounded-full transition-all ${step > s ? 'bg-blue-500' : 'bg-gray-200 dark:bg-zinc-800'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Main Content ──────────────────────────────────── */}
        <div className="max-w-3xl mx-auto px-6 py-12">
          
          <AnimatePresence mode="wait">
            {/* Step 1: Title */}
            {step >= 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mb-12"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                    <BookOpen size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">What's your blog about?</h2>
                    <p className="text-sm text-gray-500">Start with a compelling title</p>
                  </div>
                </div>

                <div className="relative">
                  <Input
                    type="text"
                    placeholder="e.g. Building Scalable React Applications in 2026"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full h-16 text-xl md:text-2xl font-bold border-0 border-b-2 border-gray-200 dark:border-zinc-700 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-blue-500 placeholder:text-gray-300 dark:placeholder:text-zinc-700 transition-colors"
                  />
                  <div className="absolute right-0 bottom-4 text-xs text-gray-400 font-medium tabular-nums">
                    {titleChars}/{maxTitleChars}
                  </div>
                </div>

                {/* Subtitle (optional) */}
                <div className="mt-6">
                  <Input
                    type="text"
                    placeholder="Add a subtitle (optional)"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full h-12 text-base border-0 border-b border-gray-100 dark:border-zinc-800 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gray-300 placeholder:text-gray-300 dark:placeholder:text-zinc-700"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 2: Category */}
            {step >= 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="mb-12"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center">
                    <Sparkles size={20} className="text-violet-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Choose a category</h2>
                    <p className="text-sm text-gray-500">Help readers discover your content</p>
                  </div>
                </div>

                {/* Category Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {categories.map((cat) => (
                    <CategoryCard
                      key={cat.value}
                      cat={cat}
                      isSelected={category?.value === cat.value}
                      onClick={() => {}}
                    />
                  ))}
                </div>

                {/* Or use select dropdown */}
                <div className="mt-6">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-3 text-center">— or search —</p>
                  <Select
                    options={categories}
                    value={category}
                    onChange={(val) => {
                      setCategory(val);
                      setStep(3);
                    }}
                    styles={selectStyles}
                    theme={selectTheme}
                    placeholder="Search categories..."
                    isSearchable
                    components={{
                      Option: ({ data, ...props }) => (
                        <div {...props.innerProps} className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 rounded-xl mx-2">
                          <span className="text-xl">{data.icon}</span>
                          <span className="text-sm font-medium text-gray-700">{data.label}</span>
                        </div>
                      ),
                    }}
                  />
                </div>
              </motion.div>
            )}

            {/* Step 3: Review & Create */}
            {step >= 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="mb-12"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2 size={20} className="text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Ready to publish?</h2>
                    <p className="text-sm text-gray-500">Review your blog details</p>
                  </div>
                </div>

                {/* Preview Card */}
                <Card className="p-6 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-2xl flex-shrink-0">
                      {category?.icon || '✍️'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">{title}</h3>
                      {subtitle && (
                        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                      )}
                      <div className="flex items-center gap-3 mt-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                          {category?.label}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="h-12 px-6 rounded-full border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 font-medium"
                  >
                    Edit Details
                  </Button>
                  <Button
                    disabled={loading}
                    onClick={createBlogHandler}
                    className="h-12 px-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-2 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        Create Blog
                        <ArrowRight size={18} />
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── Tips Section ──────────────────────────────────── */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-16 p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-500/5 dark:to-orange-500/5 rounded-2xl border border-amber-100 dark:border-amber-500/10"
            >
              <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-400 mb-3 flex items-center gap-2">
                <Sparkles size={16} />
                Writing Tips
              </h3>
              <ul className="space-y-2 text-sm text-amber-700 dark:text-amber-300/80">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                  Use specific numbers and data points in your title
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                  Keep it under 60 characters for better SEO
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                  Ask a question or make a bold statement
                </li>
              </ul>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default CreateBlog;
