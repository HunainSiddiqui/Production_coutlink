
"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_URL } from "../config";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";


const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};


const Addinfo = () => {

    const router = useRouter();
   const searchParams = useSearchParams();

   const lawyerId = searchParams.get("lawyerId");
  
  const [formData, setFormData] = useState({
    caseDescription: "",
    urgencyLevel: "Low", // Default urgency level
    contactNo: "",
    lawyerId:""
    
  });

  const [theme, setTheme] = useState("dark");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setTheme(mediaQuery.matches ? "dark" : "light");
  
    setFormData((prevData) => ({
      ...prevData,
      lawyerId: lawyerId || "", // Prefill lawyerId
    }));
  
    const handleChange = (e) => {
      setTheme(e.matches ? "dark" : "light");
    };
  
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [lawyerId]);
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
  
    if (!token) {
      toast.error("Token not found. Please log in again.");
      return;
    }
  
    if (!formData.caseDescription || !formData.contactNo) {
      toast.warn("Please fill out all required fields.");
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/v1/forms/undertrial`,
        formData, // Directly send formData
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (res.status === 201) {
        toast.success("Form submitted successfully!");
        router.push("/myrequests");
      } else {
        toast.error("Unable to submit the form. Please try again.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Error during form submission. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div
      className={`flex min-h-screen items-center justify-center px-4 py-20 sm:px-6 lg:px-8 ${
        theme === "dark"
          ? "bg-gray-900 text-gray-400"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      <div
        className={`w-full max-w-4xl space-y-8 rounded-lg p-10 shadow-lg transition-all duration-300 ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <form onSubmit={handleSubmit}>
          <motion.div
            className="space-y-12"
            initial="initial"
            animate="animate"
          >
            <motion.div
              className="border-b border-gray-900/10 pb-12"
              {...fadeInUp}
            >
              <h2
                className={`text-base font-semibold leading-7 ${
                  theme === "dark" ? "text-gray-100" : "text-gray-900"
                }`}
              >
                Submit Your Case Details
              </h2>
              <p
                className={`mt-1 text-sm leading-6 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Please provide the required information accurately to proceed.
              </p>

              {/* Case Description */}
              <motion.div className="sm:col-span-4" {...fadeInUp}>
                <label
                  htmlFor="caseDescription"
                  className={`block text-sm font-medium leading-6 ${
                    theme === "dark" ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  Case Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="caseDescription"
                    name="caseDescription"
                    placeholder="Brief description of the case or request"
                    value={formData.caseDescription}
                    onChange={handleInputChange}
                    className={`block w-full rounded-md border px-4 py-3 focus:ring-2 focus:ring-indigo-500 ${
                      theme === "dark"
                        ? "border-gray-600 bg-gray-700 text-gray-300"
                        : "border-gray-300 bg-white text-gray-900"
                    }`}
                  />
                </div>
              </motion.div>

              {/* Urgency Level */}
              <motion.div className="sm:col-span-4" {...fadeInUp}>
                <label
                  htmlFor="urgencyLevel"
                  className={`block text-sm font-medium leading-6 ${
                    theme === "dark" ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  Urgency Level
                </label>
                <div className="mt-2">
                  <select
                    id="urgencyLevel"
                    name="urgencyLevel"
                    value={formData.urgencyLevel}
                    onChange={handleInputChange}
                    className={`block w-full rounded-md border px-4 py-3 focus:ring-2 focus:ring-indigo-500 ${
                      theme === "dark"
                        ? "border-gray-600 bg-gray-700 text-gray-300"
                        : "border-gray-300 bg-white text-gray-900"
                    }`}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </motion.div>

              {/* Contact Number */}
              <motion.div className="sm:col-span-4" {...fadeInUp}>
                <label
                  htmlFor="contactNo"
                  className={`block text-sm font-medium leading-6 ${
                    theme === "dark" ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  Contact Number
                </label>
                <div className="mt-2">
                  <input
                    id="contactNo"
                    name="contactNo"
                    type="text"
                    placeholder="Enter your contact number"
                    value={formData.contactNo}
                    onChange={handleInputChange}
                    className={`block w-full rounded-md border px-4 py-3 focus:ring-2 focus:ring-indigo-500 ${
                      theme === "dark"
                        ? "border-gray-600 bg-gray-700 text-gray-300"
                        : "border-gray-300 bg-white text-gray-900"
                    }`}
                  />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`rounded-md px-6 py-3 text-lg font-semibold transition-all ${
                isSubmitting
                  ? "bg-gray-400"
                  : "bg-indigo-600 text-white hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-500"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit the request"}
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Addinfo;
