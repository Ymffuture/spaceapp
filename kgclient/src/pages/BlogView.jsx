import React, { useEffect, useState } from 'react'
import {
    Breadcrumb,
    // BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bookmark, Heart, MessageSquare, Share2 } from 'lucide-react'
import CommentBox from '@/components/CommentBox'
import axios from 'axios'
import { FaHeart, FaRegHeart } from 'react-icons/fa6'
import { setBlog } from '@/redux/blogSlice'
import { toast } from 'sonner'
import {Helmet} from 'react-helmet' 
const BlogView = () => {
    const params = useParams()
    const blogId = params.blogId
    const { blog } = useSelector(store => store.blog)
    const { user } = useSelector(store => store.auth)
    const selectedBlog = blog.find(blog => blog._id === blogId)
    const [blogLike, setBlogLike] = useState(selectedBlog?.likes.length)
    const { comment } = useSelector(store => store.comment)
    const [liked, setLiked] = useState(selectedBlog?.likes.includes(user?._id) || false);
    const dispatch = useDispatch()
    console.log(selectedBlog);

    const likeOrDislikeHandler = async () => {
        try {
            const action = liked ? 'dislike' : 'like';
            const res = await axios.get(`https://kgserver-bjy2.onrender.com/api/v1/blog/${selectedBlog?._id}/${action}`, { withCredentials: true })
            if (res.data.success) {
                const updatedLikes = liked ? blogLike - 1 : blogLike + 1;
                setBlogLike(updatedLikes);
                setLiked(!liked)

                //apne blog ko update krunga
                const updatedBlogData = blog.map(p =>
                    p._id === selectedBlog._id ? {
                        ...p,
                        likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
                    } : p
                )
                toast.success(res.data.message);
                dispatch(setBlog(updatedBlogData))
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)

        }
    }

    const changeTimeFormat = (isoDate) => {
        const date = new Date(isoDate);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-GB', options);
        return formattedDate
    }

 
    const handleShare = (blogId) => {
        const blogUrl = `${window.location.origin}/blogs/${blogId}`;
      
        if (navigator.share) {
          navigator
            .share({
              title: 'Check out this blog!',
              text: 'Read this amazing blog post.',
              url: blogUrl,
            })
            .then(() => console.log('Shared successfully'))
            .catch((err) => console.error('Error sharing:', err));
        } else {
          // fallback: copy to clipboard
          navigator.clipboard.writeText(blogUrl).then(() => {
            toast.success('Blog link copied to clipboard!');
          });
        }
      };

      useEffect(()=>{
        window.scrollTo(0,0)
      },[])
    return (
        <>
       <Helmet>
        <title>view - {selectedBlog.title} post | Qspace</title>
        <meta name="description" content="Read our latest tech, coding, and career articles." />
      </Helmet>
            
  <div className="pt-16 bg-background text-foreground">      
  <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-0">
    {/* Breadcrumb */}
    <Breadcrumb className="text-sm text-muted-foreground mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link to="/"><BreadcrumbLink>Home</BreadcrumbLink></Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <Link to="/blogs"><BreadcrumbLink>Blogs</BreadcrumbLink></Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{selectedBlog.title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    {/* Blog Header */}
    <div className="mb-8">
      <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-3 leading-tight">{selectedBlog.title}</h1>
      <p className="text-muted-foreground text-base sm:text-lg italic">{selectedBlog.subtitle}</p>

      {/* Author and Date */}
      <div className="flex items-center justify-between mt-6 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-11 h-11">
            <AvatarImage src={selectedBlog.author.photoUrl} />
            <AvatarFallback>{selectedBlog.author.firstName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="text-sm font-semibold leading-none">{selectedBlog.author.firstName} {selectedBlog.author.lastName}</h4>
            <span className="text-xs text-muted-foreground">{selectedBlog.author.occupation}</span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">📅 {changeTimeFormat(selectedBlog.createdAt)} · 8 min read</div>
      </div>
    </div>

    {/* Image */}
    <div className="rounded-xl overflow-hidden shadow-sm mb-6">
      <img src={selectedBlog.thumbnail} alt={selectedBlog.title} className="w-full object-cover" />
    </div>

    {/* Content */}
    <div className="prose dark:prose-invert prose-lg max-w-none">
      <div dangerouslySetInnerHTML={{ __html: selectedBlog.description }} />
    </div>

    {/* Tags */}
    <div className="flex flex-wrap gap-2 mt-8">
      {['Next.js', 'React', 'Web Development', 'JavaScript'].map((tag, idx) => (
        <Badge key={idx} variant="secondary" className="rounded-full px-3 py-1 text-xs hover:scale-105 transition-all">{tag}</Badge>
      ))}
    </div>

    {/* Reaction Bar */}
    <div className="sticky bottom-0 z-10 bg-background/80 backdrop-blur-md py-4 mt-10 border-t border-border flex justify-between items-center gap-4 flex-wrap">
      <div className="flex gap-4 items-center">
        <Button onClick={likeOrDislikeHandler} variant="ghost" size="icon" className="hover:bg-primary/10">
          {liked ? <FaHeart className="text-red-600" size={20} /> : <FaRegHeart className="text-muted-foreground" size={20} />}
        </Button>
        <span className="text-sm">{blogLike}</span>

        <Button variant="ghost" size="icon">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
        </Button>
        <span className="text-sm">{comment.length}</span>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="icon">
          <Bookmark className="h-5 w-5 text-muted-foreground" />
        </Button>
        <Button onClick={() => handleShare(selectedBlog._id)} variant="ghost" size="icon">
          <Share2 className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>
    </div>

    {/* Comments */}
    <div className="mt-10">
      <CommentBox selectedBlog={selectedBlog} />
    </div>

    {/* Author Profile */}
    <Card className="mt-12 border-0 shadow-md rounded-xl">
      <CardContent className="flex flex-col sm:flex-row items-start gap-4 p-6">
        <Avatar className="h-14 w-14">
          <AvatarImage src="/placeholder.svg?height=48&width=48" />
          <AvatarFallback>KG</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-lg">About {selectedBlog.author.firstName} {selectedBlog.author.lastName}</h3>
          <p className="text-muted-foreground text-sm mt-1 mb-3">
            {selectedBlog.author.firstName} is a lead developer with over 10 years of experience in web development. She specializes in React and
            Next.js and has helped numerous companies build modern, performant websites.
          </p>
          <Button variant="secondary" size="sm" className="text-xs">Follow</Button>
        </div>
      </CardContent>
    </Card>
  </div>
</div>
        </>
    )
}

export default BlogView
