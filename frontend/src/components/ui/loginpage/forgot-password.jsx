"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import bgImage from "@/assets/images/loginpage/loginbg.jpg";
import logoImage from "@/assets/images/loginpage/Vector.jpg";
import config from "@/config";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${config.API_BASE_URL}/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Something went wrong.");

      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (value && !/^[0-9]+$/.test(value)) return;
    
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Autofocus next
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if(nextInput) nextInput.focus();
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }
    
    setIsLoading(true);
    setError("");

    try {
      const OTPString = otp.join("");
      const response = await fetch(`${config.API_BASE_URL}/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: email,
          token: OTPString,
          new_password: password
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Something went wrong.");

      setStep(4); // Success
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex text-slate-800 bg-white selection:bg-blue-500 selection:text-white">
      {/* Left Side: Form Container */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 lg:px-32 xl:px-40 bg-white">
        <div className="max-w-md w-full mx-auto md:mx-auto">
          
          {error && (
            <div className="p-4 mb-6 bg-red-50 text-red-500 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}

          {/* STEP 1: FORGOT PASSWORD */}
          {step === 1 && (
            <div className="flex flex-col items-center">
              <div className="mb-6 p-4 rounded-2xl border border-gray-100 shadow-sm bg-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700"><path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"/><path d="M14 13.12c0 2.38 0 6.38-1 8.88"/><path d="M17.29 21.02c.12-.6.43-2.3.5-3.02"/><path d="M2 12a10 10 0 0 1 18-6"/><path d="M2 16h.01"/><path d="M21.8 16c.2-2 .131-5.354 0-6"/><path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2"/><path d="M8.65 22c.21-.66.45-1.32.57-2"/><path d="M9 6.8a6 6 0 0 1 9 5.2v2"/></svg>
              </div>
              <h1 className="text-3xl sm:text-[32px] font-bold mb-3 tracking-tight text-slate-900">
                Forgot password?
              </h1>
              <p className="text-gray-500 text-[15px] mb-8 font-medium">
                No worries, we'll send you reset instructions.
              </p>

              <form onSubmit={handleSendEmail} className="w-full">
                <div className="mb-6">
                  <label className="block text-[14px] font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-300 text-[15px] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-amber-600 hover:bg-amber-500 text-white py-4 rounded-xl font-semibold text-[15px] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Sending..." : "Reset password"}
                </button>
              </form>

              <div className="mt-8">
                <Link href="/" className="flex items-center text-gray-500 hover:text-gray-700 font-medium text-[15px] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                  Back to log in
                </Link>
              </div>
            </div>
          )}

          {/* STEP 2: PASSWORD RESET VERIFICATION */}
          {step === 2 && (
            <div className="flex flex-col items-center">
              <div className="mb-6 p-4 rounded-2xl border border-gray-100 shadow-sm bg-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
              <h1 className="text-3xl sm:text-[32px] font-bold mb-3 tracking-tight text-slate-900">
                Password reset
              </h1>
              <p className="text-gray-500 text-[15px] mb-8 font-medium text-center">
                We sent a code to <span className="font-semibold text-slate-800">{email}</span>
              </p>

              <div className="w-full flex justify-center gap-3 sm:gap-4 mb-6">
                {otp.map((d, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    className="w-16 h-20 sm:w-[72px] sm:h-[84px] text-center text-[40px] font-semibold text-blue-600 rounded-2xl border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all bg-white"
                  />
                ))}
              </div>

              <button
                onClick={() => setStep(3)}
                disabled={otp.join('').length < 4}
                className="w-full bg-[#1e40af] hover:bg-[#1e3a8a] text-white py-4 rounded-xl font-semibold text-[15px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-8"
              >
                Continue
              </button>

              <div className="text-center font-medium text-[15px] mb-8">
                <span className="text-gray-500">Didn't receive the email? </span>
                <span onClick={handleSendEmail} className="text-[#1e40af] hover:underline cursor-pointer font-semibold">Click to resend</span>
              </div>

              <div>
                <Link href="/" className="flex justify-center items-center text-gray-500 hover:text-gray-700 font-medium text-[15px] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                  Back to log in
                </Link>
              </div>
            </div>
          )}

          {/* STEP 3: SET NEW PASSWORD */}
          {step === 3 && (
            <div className="flex flex-col items-center">
              <div className="mb-6 p-4 rounded-2xl border border-gray-100 shadow-sm bg-white text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 9h.01"/><path d="M11 9h.01"/><path d="M15 9h.01"/><path d="M7 15h.01"/><path d="M11 15h.01"/><path d="M15 15h.01"/></svg>
              </div>
              <h1 className="text-3xl sm:text-[32px] font-bold mb-3 tracking-tight text-slate-900">
                Set new password
              </h1>
              <p className="text-gray-500 text-[15px] mb-8 font-medium text-center">
                Must be at least 8 characters.
              </p>

              <form onSubmit={handleResetPassword} className="w-full">
                <div className="mb-5">
                  <label className="block text-[14px] font-medium text-slate-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-300 text-[15px] font-medium tracking-widest focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-300 placeholder:tracking-normal"
                  />
                </div>
                
                <div className="mb-8">
                  <label className="block text-[14px] font-medium text-slate-700 mb-2">
                    Confirm password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-300 text-[15px] font-medium tracking-widest focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-300 placeholder:tracking-normal"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-amber-500 text-white py-4 rounded-xl font-semibold text-[15px] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Saving..." : "Reset password"}
                </button>
              </form>

              <div className="mt-8">
                <Link href="/" className="flex justify-center items-center text-gray-500 hover:text-gray-700 font-medium text-[15px] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                  Back to log in
                </Link>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 4 && (
            <div className="flex flex-col items-center">
              <div className="mb-6 p-4 rounded-2xl border border-green-100 bg-green-50 text-green-600 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 12 2 2 4-4"/><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/></svg>
              </div>
              <h1 className="text-3xl sm:text-[32px] font-bold mb-3 tracking-tight text-slate-900">
                Password Reset!
              </h1>
              <p className="text-gray-500 text-[15px] mb-8 font-medium text-center">
                Your password has been successfully saved.
              </p>
              
              <Link href="/" className="w-full text-center bg-[#1e40af] hover:bg-[#1e3a8a] text-white py-4 rounded-xl font-semibold text-[15px] transition-all duration-200 block">
                Continue to sign in
              </Link>
            </div>
          )}

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
