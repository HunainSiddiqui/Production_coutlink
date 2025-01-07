"use client";
import React from "react";
import axios from "axios";
import { useState } from "react";
import { BACKEND_URL } from "../../config";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { cookies } from "next/headers";

export default function forgot() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp,setotp] = useState("");
 const [password,setpassword] = useState("");
     const [confirmpassword,setconfirmpassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BACKEND_URL}/api/v1/resetpassword`, {
        email: email,
        otp:otp,
        password:password,
        confirmpassword:confirmpassword
      });
      setMessage(res.data.message);
      toast.success(res.data.message);
      router.push("/signin");
    } catch (error) {
        setMessage(error.response.data.message);
        toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="mx-auto max-w-[500px] rounded bg-white px-6 py-10 shadow-three dark:bg-dark sm:p-[60px]">
                
                <p className="mb-11 text-center text-base font-medium text-body-color">
                  Enter Your Otp to reset your password.
                </p>

                
                <form onSubmit={handleSubmit}>
  <div className="mb-8">
    <label
      htmlFor="email"
      className="mb-8 block text-sm text-dark dark:text-white font-extrabold text-center"
    >
      Reset Your Password
    </label>
    <input
      type="email"
      name="email"
      placeholder="Enter your Email"
      value={email}
      onChange={(e) => {
        setEmail(e.target.value);
      }}
      className="mb-4 border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
    />

    <input
      type="password"
      name="password"
      placeholder="Enter your New Password"
      value={password}
      onChange={(e) => {
        setpassword(e.target.value);
      }}
      className="mb-4 border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
    />

    <input
      type="confirmpassword"
      name="confirmpassword"
      placeholder="Enter Confirm Password"
      value={confirmpassword}
      onChange={(e) => {
        setconfirmpassword(e.target.value);
      }}
      className="mb-4 border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
    />

    <input
      type="otp"
      name="otp"
      placeholder="Enter your OTP"
      value={otp}
      onChange={(e) => {
        setotp(e.target.value);
      }}
      className="mb-4 border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
    />


  </div>

  <div className="mb-6">
    <button className="flex w-full items-center justify-center rounded-sm bg-primary px-9 py-4 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/90 dark:shadow-submit-dark">
      Reset Password
    </button>
  </div>
</form>

                
              </div>
            </div>
          </div>
        </div>
        <div className="absolute left-0 top-0 z-[-1]">
          <svg
            width="1440"
            height="969"
            viewBox="0 0 1440 969"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask
              id="mask0_95:1005"
              style={{ maskType: "alpha" }}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="1440"
              height="969"
            >
              <rect width="1440" height="969" fill="#090E34" />
            </mask>
            <g mask="url(#mask0_95:1005)">
              <path
                opacity="0.1"
                d="M1086.96 297.978L632.959 554.978L935.625 535.926L1086.96 297.978Z"
                fill="url(#paint0_linear_95:1005)"
              />
              <path
                opacity="0.1"
                d="M1324.5 755.5L1450 687V886.5L1324.5 967.5L-10 288L1324.5 755.5Z"
                fill="url(#paint1_linear_95:1005)"
              />
            </g>
            <defs>
              <linearGradient
                id="paint0_linear_95:1005"
                x1="1178.4"
                y1="151.853"
                x2="780.959"
                y2="453.581"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_95:1005"
                x1="160.5"
                y1="220"
                x2="1099.45"
                y2="1192.04"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>
    </>
  );
}
