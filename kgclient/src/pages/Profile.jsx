import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import userLogo from '../assets/user.jpg';
import { FaFacebook, FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { setUser } from '@/redux/authSlice';
import TotalProperty from '@/components/TotalProperty';
import {Helmet} from 'react-helmet' ;
const Profile = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(store => store.auth);
  const [input, setInput] = useState({
    firstName: user?.firstName,
    lastName: user?.lastName,
    occupation: user?.occupation,
    bio: user?.bio,
    facebook: user?.facebook,
    linkedin: user?.linkedin,
    github: user?.github,
    instagram: user?.instagram,
    file: user?.photoUrl,
  });

  const changeEventHandler = e => {
    const { name, value } = e.target;
    setInput(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const changeFileHandler = e => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('firstName', input.firstName);
    formData.append('lastName', input.lastName);
    formData.append('bio', input.bio);
    formData.append('occupation', input.occupation);
    formData.append('facebook', input.facebook);
    formData.append('linkedin', input.linkedin);
    formData.append('instagram', input.instagram);
    formData.append('github', input.github);
    if (input?.file) formData.append('file', input?.file);

    try {
      setLoading(true);
      const res = await axios.put(`https://kgserver-bjy2.onrender.com/api/v1/user/profile/update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      if (res.data.success) {
        setOpen(false);
        toast.success(res.data.message);
        dispatch(setUser(res.data.user));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (

    <>
    <Helmet>
        <title>{user?.firstName}'s profile | Qspace</title>
        <meta name="description" content="Read our latest tech, coding, and career articles." />
      </Helmet>
    
    <div className="pt-24 p-3 pr-22 md:ml-[320px] min-h-screen bg-gradient-to-br from-[#F0F8FF] to-white dark:from-[#111827] dark:to-[#1f2937]">
      <div className="max-w-6xl mx-auto px-4 md:px-0">
        <Card className="backdrop-blur-md bg-white/80 dark:bg-[#1f2937]/80 border shadow-lg rounded-3xl p-6 md:p-10 flex flex-col md:flex-row gap-10">
          {/* Profile Image + Links */}
          <div className="flex flex-col items-center md:w-[380px] gap-4">
            <Avatar className="w-44 h-44 ring-4 ring-blue-400 dark:ring-green-500 shadow-lg relative">
  <AvatarImage src={user?.photoUrl || userLogo} />
  <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full animate-pulse"></span>
</Avatar>

            <h1 className="text-center font-semibold text-xl text-gray-700 dark:text-gray-100">
              {user?.occupation || user?.firstName }
            </h1>
            <div className="flex gap-5 mt-2 text-2xl">
  <Link to={user?.facebook || '#'} target="_blank">
    <FaFacebook
      className={
        user?.facebook
          ? 'text-blue-600 hover:text-blue-800 transition'
          : 'text-gray-400 cursor-not-allowed'
      }
    />
  </Link>
  <Link to={user?.linkedin || '#'} target="_blank">
    <FaLinkedin
      className={
        user?.linkedin
          ? 'text-blue-500 hover:text-blue-700 transition'
          : 'text-gray-400 cursor-not-allowed'
      }
    />
  </Link>
  <Link to={user?.github || '#'} target="_blank">
    <FaGithub
      className={
        user?.github
          ? 'text-black dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition'
          : 'text-gray-400 cursor-not-allowed'
      }
    />
  </Link>
  <Link to={user?.instagram || '#'} target="_blank">
    <FaInstagram
      className={
        user?.instagram
          ? 'text-pink-500 hover:text-pink-600 transition'
          : 'text-gray-400 cursor-not-allowed'
      }
    />
  </Link>
</div>


          {/* Info + Bio + Edit */}
          <div className="flex-1 space-y-6">
            <div className="flex justify-between items-start">
              <Button variant="outline" onClick={() => setOpen(true)}>
                Edit Profile
              </Button>
            </div>
            <div>
              <Label className="text-lg font-medium">About Me</Label>
              <p className="mt-3 p-5 bg-gray-100 dark:bg-gray-900 rounded-xl shadow-inner text-gray-700 dark:text-gray-300">
                {user?.bio ||
                  "I'm a passionate web developer and content creator focused on frontend technologies. When I'm not coding, you can find me writing about tech, hiking, or experimenting with new recipes."}
              </p>
            </div>
          </div>
        </Card>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="md:w-[580px] rounded-xl shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-bold">Edit Profile</DialogTitle>
              <DialogDescription className="text-center">
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label>First Name</Label>
                  <Input name="firstName" value={input.firstName} onChange={changeEventHandler} />
                </div>
                <div className="flex-1">
                  <Label>Last Name</Label>
                  <Input name="lastName" value={input.lastName} onChange={changeEventHandler} />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label>Facebook</Label>
                  <Input name="facebook" value={input.facebook} onChange={changeEventHandler} />
                </div>
                <div className="flex-1">
                  <Label>Instagram</Label>
                  <Input name="instagram" value={input.instagram} onChange={changeEventHandler} />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label>LinkedIn</Label>
                  <Input name="linkedin" value={input.linkedin} onChange={changeEventHandler} />
                </div>
                <div className="flex-1">
                  <Label>Github</Label>
                  <Input name="github" value={input.github} onChange={changeEventHandler} />
                </div>
              </div>
              <div>
                <Label>Bio</Label>
                <Textarea name="bio" value={input.bio} onChange={changeEventHandler} />
              </div>
                <div className="flex-1">
                  <Label>Occupation</Label>
                  <Input name="occupation" value={input.occupation} onChange={changeEventHandler} />
                </div>
              <div>
                <Label>Profile Image</Label>
                <Input type="file" accept="image/*" onChange={changeFileHandler} />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={submitHandler} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-10 px-4 md:px-0">
        <TotalProperty />
      </div>
    </div>
    </>
  );
};

export default Profile;
