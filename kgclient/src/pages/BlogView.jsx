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
import io from 'socket.io-client';

const socket = io('https://kgserver-bjy2.onrender.com');

const BlogView = () => {
  const { blogId } = useParams();
  const { blog } = useSelector((store) => store.blog);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const selectedBlog = Array.isArray(blog) ? blog.find((b) => b._id === blogId) : null;

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(selectedBlog?.likes.length || 0);
  const [dislikeCount, setDislikeCount] = useState(selectedBlog?.dislikes?.length || 0);
  const [loading, setLoading] = useState(true);
  const [markedRead, setMarkedRead] = useState(false);

  useEffect(() => {
    if (selectedBlog) {
      setLiked(selectedBlog.likes.includes(user?._id));
    }
    setTimeout(() => setLoading(false), 800);
  }, [selectedBlog, user]);

useEffect(() => {
  if (!selectedBlog && blogId) {
    axios
      .get(`https://kgserver-bjy2.onrender.com/api/v1/blog/${blogId}`)
      .then((res) => {
        if (res.data.success) {
          dispatch(setBlog([res.data.blog])); // Add the blog to Redux
        }
      })
      .catch(() => toast.error('Failed to load blog.'));
  }
}, [selectedBlog, blogId, dispatch]);

  
  useEffect(() => {
    socket.on('reactionUpdate', ({ blogId: updatedId, likes, dislikes }) => {
      if (updatedId === selectedBlog?._id) {
        setLikeCount(likes.length);
        setDislikeCount(dislikes.length);
      }
    });
    return () => {
      socket.off('reactionUpdate');
    };
  }, [selectedBlog]);

  const toggleReaction = async (action) => {
  try {
    const res = await axios.post(
      `https://kgserver-bjy2.onrender.com/api/v1/blog/${selectedBlog?._id}/${action}`,
      {},
      { withCredentials: true }
    );

    if (res.data.success) {
      toast.success(res.data.message);

      // Emit socket update
      socket.emit('updateReaction', selectedBlog._id);

      // Update Redux blog state
      const updated = res.data.blog;
      const updatedBlog = blog.map((b) =>
        b._id === updated._id ? updated : b
      );
      dispatch(setBlog(updatedBlog));

      // Update local UI state
      setLikeCount(updated.likes.length);
      setDislikeCount(updated.dislikes.length);
      setLiked(updated.likes.includes(user._id));
      setDisliked(updated.dislikes.includes(user._id));
    }
  } catch (err) {
    toast.error(err.response?.data?.message || 'Reaction failed');
  }
};

const handleLike = () => {
  if (liked) {
    toggleReaction('unlike');
  } else {
    toggleReaction('like');
  }
};

const handleDislike = () => {
  if (disliked) {
    toggleReaction('undislike');
  } else {
    toggleReaction('dislike');
  }
};




  
  const changeTimeFormat = (isoDate) => {
    const date = new Date(isoDate);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
  };

  const handleShare = () => {
    const url = `${window.location.origin}/blogs/${blogId}`;
    if (navigator.share) {
      navigator.share({ title: 'Check out this blog!', url });
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <>
      <Helmet>
        <title>View - {selectedBlog?.title || 'Loading...'} | Qspace</title>
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

              <h1 className="text-3xl sm:text-5xl font-bold mb-3 leading-tight">{selectedBlog.title}</h1>
              <p className="text-muted-foreground italic text-lg">{selectedBlog.subtitle}</p>

              <div className="flex items-center justify-between mt-6 flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-11 h-11">
                    <AvatarImage src={selectedBlog.author.photoUrl} />
                    <AvatarFallback>{selectedBlog.author.firstName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-sm font-semibold">{selectedBlog.author.firstName} {selectedBlog.author.lastName}</h4>
                    <span className="text-xs text-muted-foreground">{selectedBlog.author.occupation}</span>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  📅 {changeTimeFormat(selectedBlog.createdAt)} · 8 min read
                </span>
              </div>

              <div className="rounded-xl overflow-hidden shadow-sm mb-6 mt-6">
                <img src={selectedBlog.thumbnail} alt={selectedBlog.title} className="w-full object-cover" />
              </div>

              <div className="prose dark:prose-invert prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: selectedBlog.description }} />
              </div>

              <div className="flex flex-wrap gap-2 mt-8">
                {['Next.js', 'React', 'Web Dev', 'JavaScript'].map((tag, i) => (
                  <Badge key={i} variant="secondary" className="rounded-full px-3 py-1 text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="sticky bottom-0 bg-background/90 backdrop-blur-md mt-10 py-4 border-t flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  <Button onClick={handleLike} variant="ghost" size="icon">
                    <ThumbsUp className={liked ? 'text-blue-600' : 'text-muted-foreground'} size={20} />
                  </Button>
                  <span className="text-sm">{likeCount}</span>

                  <Button onClick={handleDislike} variant="ghost" size="icon">
                    <ThumbsDown className={disliked ? 'text-red-600' : 'text-muted-foreground'} size={20} />
                  </Button>
                  <span className="text-sm">{dislikeCount}</span>

                  <Button variant="ghost" size="icon">
                    <MessageSquare className="text-muted-foreground" size={20} />
                  </Button>
                  <span className="text-sm">{selectedBlog.comments?.length || 0}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={markedRead ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setMarkedRead((prev) => !prev)}
                  >
                    <Bookmark className={markedRead ? 'text-green-600' : 'text-muted-foreground'} size={20} />
                  </Button>
                  <Button onClick={handleShare} variant="ghost" size="icon">
                    <Share2 className="text-muted-foreground" size={20} />
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

