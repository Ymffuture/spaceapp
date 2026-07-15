import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState } from 'react'
import { Eye, EyeOff, ArrowRight, Sparkles, CheckCircle2, Loader2 } from "lucide-react"
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet'
import auth from "../assets/auth.jpg"

const Signup = () => {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [focusedField, setFocusedField] = useState(null)

    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        password: "",
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setUser((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await axios.post(
                `https://kgserver-bjy2.onrender.com/api/v1/user/register`,
                user,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            )
            if (response.data.success) {
                navigate('/login')
                toast.success(response.data.message)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    const inputClasses = (fieldName) =>
        `h-12 rounded-xl border-2 transition-all duration-200 bg-gray-50/50 dark:bg-zinc-800/50
         ${focusedField === fieldName
            ? 'border-blue-500 ring-4 ring-blue-500/10'
            : 'border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600'
         }`

    return (
        <>
            <Helmet>
                <title>Sign up | Qspace</title>
                <meta name="description" content="Join Qspace - Create your account and start sharing your stories with the world." />
            </Helmet>

            <div className="min-h-screen flex">
                
                {/* ─── Left Side: Image ─────────────────────────────── */}
                <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
                    <img
                        src={auth}
                        alt="Authentication"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-violet-900/80" />
                    
                    {/* Content on image */}
                    <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                    <Sparkles size={20} />
                                </div>
                                <span className="text-xl font-bold">Qspace</span>
                            </div>
                            <h2 className="text-3xl font-bold leading-tight mb-3">
                                Start your writing journey today
                            </h2>
                            <p className="text-white/70 text-lg leading-relaxed">
                                Join thousands of writers and readers. Share your stories, 
                                connect with a community, and grow your audience.
                            </p>
                            
                            {/* Testimonial */}
                            <div className="mt-8 flex items-center gap-4">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 border-2 border-white/20"
                                        />
                                    ))}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">10,000+ writers</p>
                                    <p className="text-xs text-white/60">joined this month</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* ─── Right Side: Form ─────────────────────────────── */}
                <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-[#fafafa] dark:bg-[#0a0a0a]">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-md"
                    >
                        {/* Mobile Logo */}
                        <div className="lg:hidden flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-bold">
                                Q
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Qspace</span>
                        </div>

                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                                Create an account
                            </h1>
                            <p className="mt-2 text-gray-500 dark:text-zinc-400">
                                Enter your details below to get started
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            
                            {/* Name Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                                        First Name
                                    </Label>
                                    <Input
                                        type="text"
                                        name="firstName"
                                        placeholder="John"
                                        value={user.firstName}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('firstName')}
                                        onBlur={() => setFocusedField(null)}
                                        required
                                        className={inputClasses('firstName')}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                                        Last Name
                                    </Label>
                                    <Input
                                        type="text"
                                        name="lastName"
                                        placeholder="Doe"
                                        value={user.lastName}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('lastName')}
                                        onBlur={() => setFocusedField(null)}
                                        required
                                        className={inputClasses('lastName')}
                                    />
                                </div>
                            </div>

                            {/* Username */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                                    Username
                                </Label>
                                <Input
                                    type="text"
                                    name="userName"
                                    placeholder="johndoe"
                                    value={user.userName}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('userName')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                    className={inputClasses('userName')}
                                />
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                                    Email
                                </Label>
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="john@example.com"
                                    value={user.email}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                    className={inputClasses('email')}
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Create a strong password"
                                        value={user.password}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                        required
                                        minLength={6}
                                        className={`${inputClasses('password')} pr-12`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18
