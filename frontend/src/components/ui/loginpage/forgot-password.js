"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import bgImage from "@/assets/images/loginpage/loginbg.jpg";
import logoImage from "@/assets/images/loginpage/Vector.jpg";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("http://localhost:8000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Something went wrong.");
      }

      setMessage(data.msg || "If your email is registered, you will receive a reset link shortly.");
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
            <span className="text-[#fca510]">Reset </span>
            <span className="text-[#10b981]">Password</span>
          </h1>
          <p className="text-[#9ca3af] text-[13px] font-medium mb-12">
            Enter your email address and we will send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 mb-6 bg-red-50 text-red-500 rounded-lg text-sm border border-red-100">
                {error}
              </div>
            )}
            {message && (
              <div className="p-4 mb-6 bg-green-50 text-green-600 rounded-lg text-sm border border-green-100">
                {message}
              </div>
            )}

            {/* Email Input */}
            <div className="mb-8">
              <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-5 py-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-slate-300 focus:ring-4 focus:ring-slate-50 transition-all placeholder:text-slate-400 font-medium"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#f97316] hover:bg-[#ea580c] active:bg-[#c2410c] text-white py-4 rounded-xl font-bold text-xs tracking-wider shadow-[0_8px_20px_rgba(249,115,22,0.25)] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed uppercase"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-slate-500">
            Remembered your password?{" "}
            <Link href="/loginpage" className="text-[#10b981] hover:text-[#059669] transition-colors">
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side: Image Banner */}
      <div className="hidden md:flex flex-col w-1/2 relative bg-slate-100 overflow-hidden shadow-[-10px_0_30px_rgba(0,0,0,0.05)]">
        <Image
          src={bgImage}
          alt="School environment"
          fill
          sizes="50vw"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent"></div>
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
