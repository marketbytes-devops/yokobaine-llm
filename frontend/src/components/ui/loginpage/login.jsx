"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import bgImage from "@/assets/images/loginpage/loginbg.jpg";
import logoImage from "@/assets/images/loginpage/Vector.jpg";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Invalid credentials");
      }

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", data.role);

      const userRole = data.role ? data.role.toLowerCase() : "";

      switch (userRole) {
        case "admin":
        case "superadmin":
          router.push("/admin");
          break;
        case "teacher":
          router.push("/teacher");
          break;
        case "student":
          router.push("/student");
          break;
        case "parent":
          router.push("/parent");
          break;
        default:
          router.push("/dashboard");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex text-slate-800 bg-white selection:bg-[#f97316] selection:text-white">
      {/* Left Side: Form Container */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 lg:px-32 xl:px-40 bg-white">
        <div className="max-w-md w-full mx-auto md:mx-0">

          <h1 className="text-4xl sm:text-[2.75rem] font-bold mb-3 tracking-tight leading-none">
            <span className="text-[#fca510]">Wel</span>
            <span className="text-[#10b981]">come</span>
            <span className="text-[#f97316]"> Back</span>
          </h1>
          <p className="text-[#9ca3af] text-[13px] font-medium mb-12">
            Enter your email and password to sign in
          </p>

          <form onSubmit={handleLogin}>
            {error && (
              <div className="p-4 mb-6 bg-red-50 text-red-500 rounded-lg text-sm border border-red-100">
                {error}
              </div>
            )}

            {/* Email Input */}
            <div className="mb-6">
              <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-5 py-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-slate-300 focus:ring-4 focus:ring-slate-50 transition-all placeholder:text-slate-400 font-medium"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-6">
              <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full px-5 py-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-slate-300 focus:ring-4 focus:ring-slate-50 transition-all placeholder:text-slate-400 font-medium"
                />
              </div>
            </div>

            {/* Remember Me Toggle */}
            <div className="flex items-center justify-between mb-10">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10b981]"></div>
                <span className="ml-3 text-[13px] font-semibold text-slate-600">
                  Remember me
                </span>
              </label>

              <Link href="/forgot-password" className="text-[13px] font-bold text-[#f97316] hover:text-[#ea580c] transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#f97316] hover:bg-[#ea580c] active:bg-[#c2410c] text-white py-4 rounded-xl font-bold text-xs tracking-wider shadow-[0_8px_20px_rgba(249,115,22,0.25)] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed uppercase"
            >
              {isLoading ? "Authenticating..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>

      {/* Right Side: Image Banner */}
      <div className="hidden md:flex flex-col w-1/2 relative bg-slate-100 overflow-hidden shadow-[-10px_0_30px_rgba(0,0,0,0.05)]">
        {/* Main Background Image */}
        <Image
          src={bgImage}
          alt="School environment"
          fill
          sizes="50vw"
          className="object-cover object-center"
          priority
        />

        {/* Soft overlay gradient to ensure logo pops off the bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent"></div>

        {/* Logo Placement */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10 drop-shadow-xl">
          <div className="relative w-72 h-32 md:w-80 md:h-36">
            <Image
              src={logoImage}
              alt="Yokobaine Logo"
              fill
              className="object-contain mix-blend-multiply"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
