import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { loginUser } from "@/api/login";

// Validation schema
const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function CustomerLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setError(null);
      const user = await loginUser(data);

      localStorage.setItem("token", user.token);

      navigate("/customer/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center px-6">
      <div className="w-full max-w-4xl grid md:grid-cols-2 rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-col justify-center p-10 bg-gradient-to-br from-indigo-600/30 to-purple-600/30">
          <h1 className="text-4xl font-bold mb-6">Welcome Back 👋</h1>
          <p className="text-white/70 leading-relaxed">
            Login to access your dashboard, manage your products, and continue
            your journey.
          </p>
        </div>

        {/* RIGHT SIDE (FORM) */}
        <div className="p-8 md:p-10">
          <h2 className="text-3xl font-semibold mb-6 text-white">
            Login to Your Account
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* EMAIL */}
            <div>
              <label className="text-sm text-white/70">Email</label>
              <input
                {...register("email")}
                className="mt-1 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-400 outline-none text-white"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm text-white/70">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="mt-1 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-400 outline-none text-white"
                  placeholder="Enter your password"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 cursor-pointer text-sm text-white/60"
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* OPTIONS */}
            <div className="flex justify-between items-center text-sm text-white/60">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-indigo-500" />
                Remember me
              </label>

              <span className="text-indigo-400 cursor-pointer hover:underline">
                Forgot password?
              </span>
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 disabled:opacity-50"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>

            {/* REGISTER LINK */}
            <p className="text-sm text-white/60 text-center mt-4">
              Don’t have an account?{" "}
              <Link
                to="/customer/register"
                className="text-indigo-400 cursor-pointer hover:underline"
              >
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
