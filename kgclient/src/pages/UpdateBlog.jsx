import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useRef, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import JoditEditor from 'jodit-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { setBlog } from '@/redux/blogSlice'
import { Helmet } from 'react-helmet'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft,
    Loader2,
    Save,
    Trash2,
    Eye,
    EyeOff,
    ImagePlus,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Tag,
    FileText,
    Heading,
    Type,
} from 'lucide-react'

const UpdateBlog = () => {
    const editor = useRef(null)
    const [loading, setLoading] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const params = useParams()
    const id = params.blogId
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { blog } = useSelector(store => store.blog)
    const selectBlog = blog.find(blog => blog._id === id)
    const [content, setContent] = useState(selectBlog?.description || '')

    const [blogData, setBlogData] = useState({
        title: selectBlog?.title || '',
        subtitle: selectBlog?.subtitle || '',
        description: content,
        category: selectBlog?.category || '',
    })
    const [previewThumbnail, setPreviewThumbnail] = useState(selectBlog?.thumbnail || '')

    const handleChange = (e) => {
        const { name, value } = e.target
        setBlogData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const selectCategory = (value) => {
        setBlogData({ ...blogData, category: value })
    }

    const selectThumbnail = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setBlogData({ ...blogData, thumbnail: file })
            const fileReader = new FileReader()
            fileReader.onloadend = () => setPreviewThumbnail(fileReader.result)
            fileReader.readAsDataURL(file)
        }
    }

    const updateBlogHandler = async () => {
        const formData = new FormData()
        formData.append("title", blogData.title)
        formData.append("subtitle", blogData.subtitle)
        formData.append("description", content)
        formData.append("category", blogData.category)
        if (blogData.thumbnail) formData.append("file", blogData.thumbnail)

        try {
            setLoading(true)
            const res = await axios.put(
                `https://kgserver-bjy2.onrender.com/api/v1/blog/${id}`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true,
                }
            )
            if (res.data.success) {
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error("Failed to update blog")
        } finally {
            setLoading(false)
        }
    }

    const categories = [
        'Blogging', 'Web Development', 'Digital Marketing', 'Cooking',
        'Photography', 'Sports', 'Science', 'Finance',
        'Education', 'Health & Wellness', 'Technology', 'Art & Design', 'Other',
    ]

    const togglePublishUnpublish = async (action) => {
        try {
            const res = await axios.patch(
                `https://kgserver-bjy2.onrender.com/api/v1/blog/${id}`,
                {
                    params: { action },
                    withCredentials: true
                }
            )
            if (res.data.success) {
                toast.success(res.data.message)
                navigate(`/dashboard/your-blog`)
            } else {
                toast.error("Failed to update")
            }
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong")
        }
    }

    const deleteBlog = async () => {
        try {
            const res = await axios.delete(
                `https://kgserver-bjy2.onrender.com/api/v1/blog/delete/${id}`,
                { withCredentials: true }
            )
            if (res.data.success) {
                const updatedBlogData = blog.filter((blogItem) => blogItem?._id !== id)
                dispatch(setBlog(updatedBlogData))
                toast.success(res.data.message)
                navigate('/dashboard/your-blog')
            }
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong")
        }
    }

    // Jodit editor config
    const editorConfig = {
        readonly: false,
        placeholder: 'Start writing your story...',
        height: 500,
        toolbarSticky: true,
        toolbarButtonSize: 'middle',
        buttons: [
            'bold', 'italic', 'underline', 'strikethrough', '|',
            'h1', 'h2', 'h3', '|',
            'ul', 'ol', '|',
            'link', 'image', 'video', '|',
            'quote', 'code', 'table', '|',
            'align', 'undo', 'redo', '|',
            'fullsize', 'preview'
        ],
        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
        style: {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '16px',
            lineHeight: '1.8',
        },
        uploader: {
            insertImageAsBase64URI: true,
        },
    }

    const isPublished = selectBlog?.isPublished

    return (
        <>
            <Helmet>
                <title>Editing: {blogData.title || 'Blog'} | Qspace</title>
                <meta name="description" content="Edit and manage your blog post." />
            </Helmet>

            <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a]">
                
                {/* ─── Top Navigation Bar ─────────────────────────── */}
                <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0f0f0f]/80 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/[0.06]">
                    <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Back
                        </button>

                        <div className="flex items-center gap-3">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
                                ${isPublished
                                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                                    : 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
                                }`}>
                                {isPublished ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                {isPublished ? 'Published' : 'Draft'}
                            </span>
                            <span className="text-xs text-gray-400">
                                Last edited {new Date(selectBlog?.updatedAt || Date.now()).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </header>

                {/* ─── Main Content ───────────────────────────────── */}
                <div className="max-w-4xl mx-auto px-6 py-8">
                    
                    {/* Editor Card */}
                    <Card className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
                        
                        {/* Thumbnail Section */}
                        <div className="relative">
                            {previewThumbnail ? (
                                <div className="relative h-64 w-full overflow-hidden group">
                                    <img
                                        src={previewThumbnail}
                                        alt="Blog thumbnail"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-medium hover:bg-white/30 transition-colors">
                                            <ImagePlus size={16} />
                                            Change Cover
                                            <input
                                                type="file"
                                                onChange={selectThumbnail}
                                                accept="image/*"
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-t-2xl cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-500/5 transition-all group">
                                    <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <ImagePlus size={24} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium">Add a cover image</p>
                                    <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 5MB</p>
                                    <input
                                        type="file"
                                        onChange={selectThumbnail}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>

                        {/* Form Content */}
                        <div className="p-8 space-y-8">
                            
                            {/* Title */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    <Heading size={12} />
                                    Title
                                </div>
                                <Input
                                    type="text"
                                    name="title"
                                    placeholder="Enter a compelling title..."
                                    value={blogData.title}
                                    onChange={handleChange}
                                    className="border-0 border-b-2 border-gray-100 dark:border-zinc-800 rounded-none bg-transparent text-2xl md:text-3xl font-bold px-0 py-3 focus-visible:ring-0 focus-visible:border-blue-500 placeholder:text-gray-300 dark:placeholder:text-zinc-700 transition-colors"
                                />
                            </div>

                            {/* Subtitle */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    <Type size={12} />
                                    Subtitle
                                </div>
                                <Input
                                    type="text"
                                    name="subtitle"
                                    placeholder="Add a subtitle (optional)"
                                    value={blogData.subtitle}
                                    onChange={handleChange}
                                    className="border-0 border-b border-gray-100 dark:border-zinc-800 rounded-none bg-transparent text-lg text-gray-600 dark:text-zinc-400 px-0 py-2 focus-visible:ring-0 focus-visible:border-gray-300 placeholder:text-gray-300 dark:placeholder:text-zinc-700 transition-colors"
                                />
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    <Tag size={12} />
                                    Category
                                </div>
                                <Select onValueChange={selectCategory} defaultValue={blogData.category}>
                                    <SelectTrigger className="w-full md:w-[280px] h-11 rounded-xl border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 focus:ring-2 focus:ring-blue-500/20">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-gray-200 dark:border-zinc-700">
                                        <SelectGroup>
                                            <SelectLabel className="text-xs text-gray-400">Categories</SelectLabel>
                                            {categories.map((cat) => (
                                                <SelectItem 
                                                    key={cat} 
                                                    value={cat}
                                                    className="rounded-lg cursor-pointer focus:bg-blue-50 dark:focus:bg-blue-500/10"
                                                >
                                                    {cat}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Editor */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    <FileText size={12} />
                                    Content
                                </div>
                                <div className="border border-gray-100 dark:border-zinc-800 rounded-2xl overflow-hidden">
                                    <JoditEditor
                                        ref={editor}
                                        value={content}
                                        config={editorConfig}
                                        onBlur={newContent => setContent(newContent)}
                                        className="jodit_toolbar"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="px-8 py-6 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => navigate(-1)}
                                    className="h-10 px-5 rounded-full border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={updateBlogHandler}
                                    disabled={loading}
                                    className="h-10 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-2 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={16} />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => togglePublishUnpublish(isPublished ? "false" : "true")}
                                    className={`h-10 px-5 rounded-full gap-2 font-medium
                                        ${isPublished
                                            ? 'border-amber-200 text-amber-600 hover:bg-amber-50 dark:border-amber-500/30 dark:text-amber-400 dark:hover:bg-amber-500/10'
                                            : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-500/30 dark:text-emerald-400 dark:hover:bg-emerald-500/10'
                                        }`}
                                >
                                    {isPublished ? <EyeOff size={16} /> : <Eye size={16} />}
                                    {isPublished ? 'Unpublish' : 'Publish'}
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="h-10 px-4 rounded-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10 gap-2"
                                >
                                    <Trash2 size={16} />
                                    <span className="hidden sm:inline">Delete</span>
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* ─── Delete Confirmation Dialog ─────────────────── */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
                        onClick={() => setShowDeleteConfirm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white dark:bg-zinc-900 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-100 dark:border-zinc-800"
                        >
                            <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mb-4">
                                <AlertTriangle size={24} className="text-red-500" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                Delete this blog?
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-zinc-400 mb-6">
                                This action cannot be undone. This will permanently delete <strong>{blogData.title}</strong> and remove it from our servers.
                            </p>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 h-11 rounded-full"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => {
                                        deleteBlog()
                                        setShowDeleteConfirm(false)
                                    }}
                                    className="flex-1 h-11 rounded-full bg-red-600 hover:bg-red-700 text-white"
                                >
                                    <Trash2 size={16} className="mr-2" />
                                    Delete
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default UpdateBlog
