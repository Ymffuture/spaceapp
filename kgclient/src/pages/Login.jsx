import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import auth from "../assets/auth.jpg";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic client-side validation
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
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        dispatch(setUser(response.data.user));
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen p-4 bg-[#F0F8FF] dark:bg-gray-950">
      {/* Left Image */}
      <div className="hidden md:block w-1/2">
        <img src={auth} alt="Auth Visual" className="w-full h-auto max-h-[720px] object-cover rounded-xl shadow-md" />
      </div>

      {/* Right Form Card */}
      <div className="flex-1 w-full max-w-md mx-auto">
        <Card className="w-full p-6 shadow-xl rounded-2xl dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">Login to your account</CardTitle>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
              Enter your credentials to access your account
            </p>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="example@domain.com"
                  value={input.email}
                  onChange={handleChange}
                  className="dark:border-gray-600 dark:bg-gray-800"
                />
              </div>

              <div className="relative">
                <Label>Password</Label>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={input.password}
                  onChange={handleChange}
                  className="dark:border-gray-600 dark:bg-gray-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-9 right-3 text-gray-500 dark:text-gray-300"
                  aria-label="Toggle Password Visibility"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full  transition duration-300"
              >
                {loading ? "Logging in..." : "Login"}
              </Button>

              <p className="text-center text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <Link to="/signup" className="underline hover:text-[#1E90FF]">
                  Sign up
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
