import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router"
import { registerUser } from "@/api/register";

// Validation Schema
const schema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  address: z.string().min(5, "Address is required"),
  phone: z.string().min(10, "Enter a valid phone number"),
});

export default function CustomerRegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const user = await registerUser({
        fullName: data.name,
        email: data.email,
        password: data.password,
        address: data.address,
        phoneNumber: data.phone,
      });

      localStorage.setItem("token", user.token);
      console.log("User Created:", user);

      navigate("/customer/dashboard", { replace: true })
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-5xl grid md:grid-cols-2 rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">

        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-col justify-center p-10 bg-gradient-to-br from-indigo-600/30 to-purple-600/30">
          <h1 className="text-4xl font-bold mb-6">Join Our Marketplace</h1>
          <p className="text-white/70 leading-relaxed">
            Create your account to start buying and selling with confidence.
          </p>
        </div>

        {/* FORM */}
        <div className="p-8 md:p-10">
          <h2 className="text-3xl font-semibold mb-6 text-white">Create Account</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* NAME */}
            <div>
              <label className="text-sm text-white/70">Full Name</label>
              <input
                {...register("name")}
                className="mt-1 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-400 outline-none text-white"
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm text-white/70">Email</label>
              <input
                {...register("email")}
                className="mt-1 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-400 outline-none text-white"
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm text-white/70">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="mt-1 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-400 outline-none text-white"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 cursor-pointer text-sm text-white/60"
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
            </div>

            {/* ADDRESS */}
            <div>
              <label className="text-sm text-white/70">Address</label>
              <input
                {...register("address")}
                className="mt-1 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-400 outline-none text-white"
              />
              {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address.message}</p>}
            </div>

            {/* PHONE */}
            <div>
              <label className="text-sm text-white/70">Phone</label>
              <input
                {...register("phone")}
                className="mt-1 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-400 outline-none text-white"
              />
              {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>}
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 mt-4 disabled:opacity-50"
            >
              {isSubmitting ? "Creating Account..." : "Register"}
            </button>
            <br />

            <Link to="/login" className="text-sm text-white/60 text-center mt-4 block">
              Already have an account? <span className="text-indigo-400 cursor-pointer">Login</span>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
