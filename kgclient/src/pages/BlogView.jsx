import React, { useEffect, useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, MessageSquare, Bookmark, Share2 } from 'lucide-react';
import CommentBox from '@/components/CommentBox';
import axios from 'axios';
import { setBlog } from '@/redux/blogSlice';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet';
import { Skeleton } from '@/components/ui/skeleton';

const BlogView = () => {
  const params = useParams();
  const blogId = params.blogId;
  const { blog } = useSelector((store) => store.blog);
  const { user } = useSelector((store) => store.auth);
  const selectedBlog = blog.find((b) => b._id === blogId);

  const [blogLike, setBlogLike] = useState(selectedBlog?.likes.length || 0);
  const [liked, setLiked] = useState(selectedBlog?.likes.includes(user?._id) || false);
  const [disliked, setDisliked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [markedRead, setMarkedRead] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
    const timeout = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timeout);
  }, []);

  const likeHandler = async () => {
    if (liked) {
      await toggleReaction('dislike', false);
      setLiked(false);
      setBlogLike(blogLike - 1);
    } else {
      if (disliked) setDisliked(false);
      await toggleReaction('like', true);
      setLiked(true);
      setBlogLike(disliked ? blogLike + 2 : blogLike + 1);
    }
  };

  const dislikeHandler = async () => {
    if (disliked) {
      setDisliked(false);
      toast('Dislike removed');
    } else {
      if (liked) {
        await toggleReaction('dislike', false);
        setLiked(false);
        setBlogLike(blogLike - 1);
      }
      setDisliked(true);
      toast('You disliked this');
    }
  };

  const toggleReaction = async (action, applyToast = true) => {
    try {
      const res = await axios.get(`https://kgserver-bjy2.onrender.com/api/v1/blog/${selectedBlog?._id}/${action}`, {
        withCredentials: true,
      });

      if (res.data.success && applyToast) {
        toast.success(res.data.message);
        const updatedBlogData = blog.map((p) =>
          p._id === selectedBlog._id
            ? {
                ...p,
                likes:
                  action === 'like'
                    ? [...p.likes, user._id]
                    : p.likes.filter((id) => id !== user._id),
              }
            : p
        );
        dispatch(setBlog(updatedBlogData));
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error occurred');
    }
  };

  const changeTimeFormat = (isoDate) => {
    const date = new Date(isoDate);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
  };

  const handleShare = (blogId) => {
    const blogUrl = `${window.location.origin}/blogs/${blogId}`;
    if (navigator.share) {
      navigator
        .share({ title: 'Check out this blog!', text: 'Read this amazing blog post.', url: blogUrl })
        .then(() => console.log('Shared successfully'))
        .catch((err) => console.error('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(blogUrl).then(() => {
        toast.success('Blog link copied to clipboard!');
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>view - {selectedBlog?.title || 'Loading...'} | Qspace</title>
      </Helmet>
      <div className="pt-16 bg-background text-foreground">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-0">
          {loading || !selectedBlog ? (
            <>
              <Skeleton className="h-6 w-40 mb-3" />
              <Skeleton className="h-10 w-full mb-2 rounded-lg" />
              <Skeleton className="h-5 w-1/2 mb-6" />
              <div className="flex items-center gap-4 mb-6">
                <Skeleton className="h-11 w-11 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-40 mb-1" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-[240px] w-full mb-6 rounded-xl" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-5/6 mb-2" />
              <Skeleton className="h-5 w-3/4 mb-6" />
              <div className="flex gap-2 mb-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-6 w-20 rounded-full" />
                ))}
              </div>
              <div className="flex items-center gap-4 mb-10">
                <Skeleton className="h-5 w-10" />
                <Skeleton className="h-5 w-10" />
                <Skeleton className="h-5 w-10" />
              </div>
            </>
          ) : (
            <>
              <Breadcrumb className="text-sm text-muted-foreground mb-6">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <Link to="/">
                      <BreadcrumbLink>Home</BreadcrumbLink>
                    </Link>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <Link to="/blogs">
                      <BreadcrumbLink>Blogs</BreadcrumbLink>
                    </Link>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{selectedBlog.title}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-3 leading-tight">
                {selectedBlog.title}
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg italic">{selectedBlog.subtitle}</p>
              <div className="flex items-center justify-between mt-6 flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-11 h-11">
                    <AvatarImage src={selectedBlog.author.photoUrl} />
                    <AvatarFallback>{selectedBlog.author.firstName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-sm font-semibold leading-none">
                      {selectedBlog.author.firstName} {selectedBlog.author.lastName}
                    </h4>
                    <span className="text-xs text-muted-foreground">{selectedBlog.author.occupation}</span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  📅 {changeTimeFormat(selectedBlog.createdAt)} · 8 min read
                </div>
              </div>
              <div className="rounded-xl overflow-hidden shadow-sm mb-6 mt-6">
                <img src={selectedBlog.thumbnail} alt={selectedBlog.title} className="w-full object-cover" />
              </div>
              <div className="prose dark:prose-invert prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: selectedBlog.description }} />
              </div>
              <div className="flex flex-wrap gap-2 mt-8">
                {["Next.js", "React", "Web Development", "JavaScript"].map((tag, idx) => (
                  <Badge key={idx} variant="secondary" className="rounded-full px-3 py-1 text-xs hover:scale-105 transition-all">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="sticky bottom-0 z-10 bg-background/80 backdrop-blur-md py-4 mt-10 border-t border-border flex justify-between items-center gap-4 flex-wrap">
                <div className="flex gap-4 items-center">
                  <Button onClick={likeHandler} variant="ghost" size="icon" className="hover:bg-blue-100 dark:hover:bg-blue-900">
                    <ThumbsUp className={liked ? 'text-blue-600' : 'text-muted-foreground'} size={20} />
                  </Button>
                  <Button onClick={dislikeHandler} variant="ghost" size="icon" className="hover:bg-red-100 dark:hover:bg-red-900">
                    <ThumbsDown className={disliked ? 'text-red-600' : 'text-muted-foreground'} size={20} />
                  </Button>
                  <span className="text-sm">{blogLike}</span>
                  <Button variant="ghost" size="icon">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  </Button>
                  <span className="text-sm">{selectedBlog?.comments?.length || 0}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant={markedRead ? 'default' : 'ghost'} size="icon" onClick={() => setMarkedRead(!markedRead)}>
                    <Bookmark className={`h-5 w-5 ${markedRead ? 'text-green-600' : 'text-muted-foreground'}`} />
                  </Button>
                  <Button onClick={() => handleShare(selectedBlog._id)} variant="ghost" size="icon">
                    <Share2 className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </div>
              </div>
              <div className="mt-10">
                <CommentBox selectedBlog={selectedBlog} />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogView;

