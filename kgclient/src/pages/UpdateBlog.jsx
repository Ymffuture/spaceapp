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
import JoditEditor from 'jodit-react';
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { setBlog } from '@/redux/blogSlice'

const UpdateBlog = () => {
    const editor = useRef(null);
   
    const [loading, setLoading] = useState(false)
    const [publish, setPublish] = useState(false)
    const params = useParams()
    const id = params.blogId
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { blog } = useSelector(store => store.blog)
    const selectBlog = blog.find(blog => blog._id === id)
    const [content, setContent] = useState(selectBlog.description);

    const [blogData, setBlogData] = useState({
        title: selectBlog?.title,
        subtitle: selectBlog?.subtitle,
        description: content,
        category: selectBlog?.category,
    });
    const [previewThumbnail, setPreviewThumbnail] = useState(selectBlog?.thumbnail);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBlogData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const selectCategory = (value) => {
        setBlogData({ ...blogData, category: value });
    };

    const selectThumbnail = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setBlogData({ ...blogData, thumbnail: file });
            const fileReader = new FileReader();
            fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
            fileReader.readAsDataURL(file);
        }
    };

    const updateBlogHandler = async () => {

        const formData = new FormData();
        formData.append("title", blogData.title);
        formData.append("subtitle", blogData.subtitle);
        formData.append("description", content);
        formData.append("category", blogData.category);
        formData.append("file", blogData.thumbnail);
        try {
            setLoading(true)
            const res = await axios.put(`http://localhost:9123/api/v1/blog/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true,
            })
            if (res.data.success) {
                toast.success(res.data.message)
                console.log(blogData);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    }

    const tags = [
        { category: 'Blogging' },
        { category: 'Web Development' },
        { category: 'Digital Marketing' },
        { category: 'Cooking' },
        { category: 'Photography' },
        { category: 'Sports' },
        { category: 'Science' },
        { category: 'Finance' },
        { category: 'Education' },
        { category: 'Health & Wellness' },
        { category: 'Technology' },
        { category: 'Art & Design' },
    ];

    const togglePublishUnpublish = async (action) => {
        try {
            const res = await axios.patch(`http://localhost:9123/api/v1/blog/${id}`, {
                params: {
                    action
                },
                withCredentials: true
            })
            if (res.data.success) {
                setPublish(!publish)
                toast.success(res.data.message)
                navigate(`/dashboard/your-blog`)
            } else {
                toast.error("Failed to update")
            }
        } catch (error) {
            console.log(error);
        }
    }

    const deleteBlog = async () => {
        try {
            const res = await axios.delete(`http://localhost:9123/api/v1/blog/delete/${id}`, { withCredentials: true })
            if (res.data.success) {
                const updatedBlogData = blog.filter((blogItem) => blogItem?._id !== id);
                dispatch(setBlog(updatedBlogData))
                toast.success(res.data.message)
                navigate('/dashboard/your-blog')
            }
            console.log(res.data.message);
        } catch (error) {
            console.log(error);
            toast.error("something went error")
        }
    }

    return (
        <div className='pb-10 px-3 pt-20 md:ml-[320px]'>
            <div className='max-w-6xl mx-auto mt-8'>
                <Card className="w-full bg-gradient-to-br from-white via-slate-100 to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 p-8 space-y-6 rounded-2xl shadow-xl border border-blue-200 dark:border-gray-700 relative">
                    <h1 className='text-4xl font-extrabold tracking-tight text-gray-800 dark:text-white'>Update Your Blog</h1>
                    <p className='text-sm text-muted-foreground'>Revise your blog content and choose to publish it or keep it as draft.</p>
                  
                    <div className='space-y-4'>
                        <div>
                            <Label>Title</Label>
                            <Input type="text" placeholder="Enter a title" name="title" value={blogData.title} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Subtitle</Label>
                            <Input type="text" placeholder="Enter a subtitle" name="subtitle" value={blogData.subtitle} onChange={handleChange} />
                        </div>
                           <div>
                        <Label>Description</Label>
                        <JoditEditor
                            ref={editor}
                            value={blogData.description}
                            onChange={newContent => setContent(newContent)}
                            className="jodit_toolbar"

                        />
                    </div>
                        <div>
                            <Label>Category</Label>
                            <Select onValueChange={selectCategory}>
                                <SelectTrigger className="w-full md:w-[240px]">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Category</SelectLabel>
                                        {tags.map((tag, index) => (
                                            <SelectItem key={index} value={tag.category}>
                                                {tag.category}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Thumbnail</Label>
                            <Input
                                id="file"
                                type="file"
                                onChange={selectThumbnail}
                                accept="image/*"
                                className="w-fit"
                            />
                            {previewThumbnail && (
                                <img
                                    src={previewThumbnail}
                                    className="w-64 my-2 rounded-xl border shadow-md"
                                    alt="Blog Thumbnail"
                                />
                            )}
                        </div>
                        <div className='flex gap-4'>
                            <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
                            <Button onClick={updateBlogHandler} className='bg-gradient-to-r from-blue-500 to-green-400 text-white hover:from-green-400 hover:to-blue-500'>
                                {loading ? "Please Wait" : "Save Changes"}
                            </Button>
                        </div>
                    </div>
                      <div className="flex flex-wrap gap-3 absolute right-[10px] bottom-[14px]">
                        <Button onClick={() => togglePublishUnpublish(selectBlog.isPublished ? "false" : "true")}
                            className='bg-gradient-to-r from-green-400 to-blue-500 hover:from-blue-500 hover:to-green-400'>
                            {selectBlog?.isPublished ? "UnPublish" : "Publish"}
                        </Button>
                        <Button variant="destructive" className='bg-[traansparate] border-2 border-[red] text-[pink]' onClick={deleteBlog}>Delete</Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default UpdateBlog
