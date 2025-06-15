import React, { useState } from 'react'
import { Button } from './ui/button'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Input } from './ui/input'
import Logo from "../assets/Qspace.svg"
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import axios from 'axios'
import { setUser } from '@/redux/authSlice'
import userLogo from "../assets/user.jpg"
import { HiMenuAlt1, HiMenuAlt3 } from "react-icons/hi";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import {
    ChartColumnBig,
    Cloud,
    CreditCard,
    Github,
    Keyboard,
    LifeBuoy,
    LogOut,
    Mail,
    MessageSquare,
    Plus,
    PlusCircle,
    Search,
    Settings,
    User,
    UserPlus,
    Users,
} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FaCheckCircle, FaEdit, FaHome, FaInfoCircle, FaMoon, FaRegEdit, FaSignInAlt, FaSignOutAlt, FaSun } from 'react-icons/fa'
import { toggleTheme } from '@/redux/themeSlice'
import { LiaCommentSolid } from 'react-icons/lia'
import ResponsiveMenu from './ResponsiveMenu'
import { FaBlog, FaUser } from 'react-icons/fa6'

const Navbar = () => {
    const { user } = useSelector(store => store.auth)
    const { theme } = useSelector(store => store.theme)
    const [searchTerm, setSearchTerm] = useState('');
    const [openNav, setOpenNav] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    // const user = false;

  const [hovered, setHovered] = useState(false)
    const logoutHandler = async (e) => {

        try {
            const res = await axios.get(`https://kgserver-bjy2.onrender.com/api/v1/user/logout`, { withCredentials: true });
            if (res.data.success) {
                navigate("/")
                dispatch(setUser(null))
                toast.success(res.data.message)
            }
         
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)

        }
    }

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim() !== '') {
            navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
            setSearchTerm('')
        }
    };

    const toggleNav = ()=>{
        setOpenNav(!openNav)
    }
    return (
        <div className='py-2 fixed w-full dark:bg-gray-800 dark:border-b-gray-600 border-b-gray-300 border-1 bg-white z-50'>
            <div className='max-w-7xl mx-auto flex justify-between items-center px-4 md:px-0'>
                {/* logo section */}
                <div className='flex gap-7 items-center'>
                     {
                        openNav ? <HiMenuAlt3 onClick={toggleNav} className='w-7 h-7 md:hidden' /> : <HiMenuAlt1 onClick={toggleNav} className='w-7 h-7 md:hidden' />
                    }
                    <Link to={'/'}>
                        <div className='flex gap-2 items-center'>
                             <img src={Logo} alt="Qspace" className='w-12 h-12 md:w-10 md:h-10 dark:invert' /> 
                            {/*    <h1 className='font-bold text-3xl md:text-4xl'>Qspace</h1>*/}
                        </div>
                    </Link>
                    <div className='relative hidden md:block'>
                        <Input 
                            placeholder="Search ..."
                            type='search'
                            className="border-0 dark:bg-gray-900 w-[600px] hidden md:block"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search onClick={handleSearch} className='absolute right-[30px] top-[6px] text-[10px] text-[#5a5a5a] cursor-pointer'/>
                        
                    </div>
                </div>
                {/* nav section */}
                <nav className='flex md:gap-7 gap-4 items-center'>
                    <ul className='hidden md:flex gap-7 items-center text-xl border-2 border-[#4f4f4f38] p-2 px-3 rounded-3xl hover:bg-slate-600/25'>
                        <NavLink data-tooltip-id="my-tooltip-dm"
              data-tooltip-content="Home" to={'/'} className="cursor-pointer"><li><FaHome className='hover:bg-[#0000003f] p-1 text-[25px] rounded-full transition-all'/></li></NavLink>
                        <NavLink
                        data-tooltip-id="1"
              data-tooltip-content="Blog"
                        to={'/blogs'} className={`cursor-pointer`}><li><FaBlog className='hover:bg-[#0000003f] p-1 text-[25px] rounded-full transition-all' /></li></NavLink>
                        <NavLink 
                        data-tooltip-id="2"
              data-tooltip-content="About"
                        to={'/about'} className={`cursor-pointer`}><li><FaInfoCircle className='hover:bg-[#0000003f] p-1 text-[25px] rounded-full transition-all' /></li></NavLink>
                        <NavLink onClick={() => navigate('/dashboard/write-blog')}     data-tooltip-id="5"
              data-tooltip-content="Write a Blog" className={`cursor-pointer`}><FaRegEdit className='hover:bg-[#0000003f] p-1 text-[25px] rounded-full transition-all'/></NavLink>
                        <NavLink className='md:block'>
                            <li>
                                <div onClick={() => dispatch(toggleTheme())} className=" dark:text-white bg-[transparent] text-[gray]"
                            data-tooltip-id="3"
              data-tooltip-content="Theme"
                            >
                            {
                                theme === 'light' ? <FaMoon /> : <FaSun />
                            }

                        </div>
                            </li>
                        </NavLink>
                    </ul>
                    <div className='flex '>
                           <Button onClick={() => dispatch(toggleTheme())} className=" dark:text-white bg-[transparent] text-[gray] md:hidden shadow-none hover:bg-transparent "
                            data-tooltip-id="3"
              data-tooltip-content="Theme"
                            >
                            {
                                theme === 'light' ? <FaMoon /> : <FaSun />
                            }

                        </Button>
                        {
                            user ? <div className="ml-7 flex gap-3 items-center"
                             data-tooltip-id="4"
              data-tooltip-content="Profile"
                            >
                                {/* <Link to={'/profile'}> */}
                                <DropdownMenu>
      <div
        className="relative group"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer hover:scale-105 transition-all duration-300 shadow-md">
            <AvatarImage src={user.photoUrl || '/user.png'} />
            <AvatarFallback className="bg-[#1E90FF] text-white">
              <FaUser />
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        {/* Profile Preview Card */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-12 top-0 w-60 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-4 z-50"
            >
              <p className="text-sm font-bold text-[#1E90FF]">
                {user.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user.email}
              </p>
              {user.email === 'futurekgomotso@gmail.com' && (
                <span className="text-[10px] text-white bg-[#FFD700] px-2 py-[2px] rounded-full mt-1 inline-block">
                  Admin <FaCheckCircle className="inline ml-1" />
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        <DropdownMenuContent
          asChild
          side="bottom"
          align="end"
          className="w-64 bg-white dark:bg-[#1a1a1a] border dark:border-gray-700 rounded-xl p-2 shadow-2xl z-50"
        >
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <DropdownMenuLabel className="flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm text-white bg-gradient-to-r from-[#1E90FF] via-[#32CD32] to-[#FFD700]">
              {user.email === 'futurekgomotso@gmail.com' ? (
                <>
                  Admin <FaCheckCircle />
                </>
              ) : (
                'My Account'
              )}
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="my-2 border-t dark:border-gray-700" />

            <DropdownMenuGroup className="space-y-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              <DropdownMenuItem
                onClick={() => navigate('/dashboard/profile')}
                className="flex items-center gap-2 px-3 py-2 hover:bg-[#F0F8FF] dark:hover:bg-[#2a2a2a] rounded-lg transition"
              >
                <User className="text-[#1E90FF]" />
                <span>Profile</span>
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => navigate('/dashboard/your-blog')}
                className="flex items-center gap-2 px-3 py-2 hover:bg-[#F0F8FF] dark:hover:bg-[#2a2a2a] rounded-lg transition"
              >
                <ChartColumnBig className="text-[#32CD32]" />
                <span>Your Blog</span>
                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => navigate('/dashboard/comments')}
                className="flex items-center gap-2 px-3 py-2 hover:bg-[#F0F8FF] dark:hover:bg-[#2a2a2a] rounded-lg transition"
              >
                <LiaCommentSolid className="text-[#FFD700]" />
                <span>Comments</span>
                <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => navigate('/dashboard/write-blog')}
                className="flex items-center gap-2 px-3 py-2 hover:bg-[#F0F8FF] dark:hover:bg-[#2a2a2a] rounded-lg transition"
              >
                <FaRegEdit className="text-[#1E90FF]" />
                <span>Write Blog</span>
                <DropdownMenuShortcut>⌘W</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="my-2 border-t dark:border-gray-700" />

            <DropdownMenuItem
              onClick={logoutHandler}
              className="flex items-center gap-2 px-3 py-2 hover:bg-red-100 dark:hover:bg-red-800 rounded-lg transition font-semibold text-red-600"
            >
              <LogOut />
              <span>Log out</span>
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </motion.div>
        </DropdownMenuContent>
      </AnimatePresence>
    </DropdownMenu>
                                {/* </Link> */}

                                {/* <Button className="hidden md:block" onClick={logoutHandler}><FaSignOutAlt className='text-[red]'/></Button> */}

                            </div> : <div className='ml-7 md:flex gap-2 '>
                                <Link to={'/login'}><Button className='bg-[transparent] border-1 border-[gray] text-[black] dark:text-white shadow-none hover:bg-transparent hover:text-[gray]'> <FaSignInAlt/> Login</Button></Link>
                                {/* <Link className='hidden md:block' to={'/signup'}><Button>Signup</Button></Link> */}
                            </div>
                        }
                    </div>
                  

                </nav>
                <ResponsiveMenu openNav={openNav} setOpenNav={setOpenNav} logoutHandler={logoutHandler}/>
            </div>
             <Tooltip id="my-tooltip-dm" />
             <Tooltip id="1" />
             <Tooltip id="2" />
             <Tooltip id="3" />
             <Tooltip id="4" />
             <Tooltip id="5" />
        </div>
    )
}

export default Navbar
