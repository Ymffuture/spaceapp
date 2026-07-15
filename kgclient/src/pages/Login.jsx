import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowRight, Sparkles, Loader2, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { motion } from 'framer-motion';
import { setUser } from "@/redux/authSlice";
import auth from "../assets/auth.jpg";
import { Helmet } from "react-helmet";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [input, setInput] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        "https://kgserver-bjy2.onrender.com/api/v1/user/auth/google-login",
        { token: credentialResponse.credential },
        { withCredentials: true }
      );
      dispatch(setUser(res.data.user));
      toast.success("Google login successful!");
      navigate("/");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Google Login Failed");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.email || !input.password) {
      toast.error("Email and password are required.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `https://kgserver-bjy2.onrender.com/api/v1/user/login`,
        input,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        dispatch(setUser(response.data.user));
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = (fieldName) =>
    `h-12 rounded-xl border-2 transition-all duration-200 bg-gray-50/50 dark:bg-zinc-800/50
     ${focusedField === fieldName
        ? 'border-blue-500 ring-4 ring-blue-500/10'
        : 'border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600'
     }`;

  return (
    <>
      <Helmet>
        <title>Log in | Qspace</title>
        <meta name="description" content="Sign in to your Qspace account to access your blogs, comments, and more." />
      </Helmet>

      <GoogleOAuthProvider clientId="755156469559-fk5bfd44pborgg9ad4omcuj786d27h8b.apps.googleusercontent.com">
        <div className="min-h-screen flex">
          
          {/* ─── Left Side: Image ─────────────────────────────── */}
          <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
            <img
              src={auth}
              alt="Authentication"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-violet-900/80" />
            
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
                  Welcome back
                </h2>
                <p className="text-white/70 text-lg leading-relaxed">
                  Sign in to continue your writing journey, engage with your readers, 
                  and explore new content.
                </p>
                
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
                    <p className="text-xs text-white/60">active this week</p>
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
                  Welcome back
                </h1>
                <p className="mt-2 text-gray-500 dark:text-zinc-400">
                  Sign in to your account to continue
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Email */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                    Email
                  </Label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={input.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className={inputClasses('email')}
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                      Password
                    </Label>
                    <Link
                      to="/forgot-password"
                      className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                      value={input.password}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className={`${inputClasses('password')} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="remember" className="text-sm text-gray-600 dark:text-zinc-400">
                    Remember me for 30 days
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base gap-2 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight size={18} />
                    </>
                  )}
                </Button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-zinc-700" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-4 bg-[#fafafa] dark:bg-[#0a0a0a] text-gray-400">
                      or continue with
                    </span>
                  </div>
                </div>

                {/* Google OAuth */}
                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => toast.error("Login Failed")}
                    shape="pill"
                    theme="outline"
                    text="continue_with"
                    width="100%"
                  />
                </div>

                {/* Footer Links */}
                <div className="space-y-3 pt-2">
                  <p className="text-center text-sm text-gray-600 dark:text-zinc-400">
                    Don't have an account?{' '}
                    <Link
                      to="/signup"
                      className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      Create one
                    </Link>
                  </p>
                  <p className="text-center text-xs text-gray-400 dark:text-zinc-500">
                    By signing in, you agree to our{' '}
                    <Link to="/terms" className="underline hover:text-blue-600 transition-colors">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="underline hover:text-blue-600 transition-colors">
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </GoogleOAuthProvider>
    </>
  );
};

export default Login;
