"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "react-circular-progressbar/dist/styles.css";
import { BACKEND_URL } from "../../config";
import { useRouter } from "next/navigation";
import { cookies } from "next/headers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 


const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const LawyerForm = () => {
  const Router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact:"",
    dateOfBirth: "",
    barRegistrationNumber: "",
    casesSolved: "",
    specializations: "",
    licenseVerified: "",
    availability: "",
    additionalInfo: "",


    file: null,
  });
  const [theme, setTheme] = useState("dark");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setTheme(mediaQuery.matches ? "dark" : "light");

    const handleChange = (e) => {
      setTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="));
 
  if (!token) {
    toast.error("Token not found. Please log in again.");
    return;
  }
 
  const tokenValue = token.split("=")[1];
  console.log(tokenValue);
  

    setIsSubmitting(true);
    if (
      !formData.name ||
      !formData.email ||
      !formData.contact ||
      !formData.dateOfBirth ||
      !formData.barRegistrationNumber ||
      !formData.casesSolved ||
      !formData.specializations ||
      !formData.licenseVerified ||
      !formData.availability ||
      !formData.additionalInfo
    ) {
      toast.warn("Please fill out all required fields.");
      setIsSubmitting(false);
      return;
    }
    //  Token
 

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/v1/forms/lawyerform`,
        {
          name: formData.name,
          email: formData.email,
          contacts: formData.contact,
          dateOfBirth: formData.dateOfBirth,
          barRegistrationNumber: formData.barRegistrationNumber,
          casesSolved: formData.casesSolved,
          specializations: formData.specializations,
          licenseVerified: formData.licenseVerified,
          availability: formData.availability,
          additionalInfo: formData.additionalInfo,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenValue}`,
          },
        },
      );
      
      if (res.status === 201) {
        setProgress(25);
        toast.success("Application submitted successfully!...");
        
        Router.push("/lawyerprofile");
      } else {
        toast.error("Unable to submit application. Please try again.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Error during Application. Please try again.";

      toast.error("Error during Application. Please try again",errorMessage);
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

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      file: e.target.files[0],
    }));
  };

  return (
    <div
      className={`flex min-h-screen items-center justify-center px-4 py-20 sm:px-6 lg:px-8 ${theme === "dark" ? "bg-gray-900 text-gray-400" : "bg-gray-50 text-gray-900"}`}
    >
      <div
        className={`w-full max-w-4xl space-y-8 rounded-lg p-10 shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
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
                className={`text-base font-semibold leading-7 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}
              >
                Update Lawyers Profile
              </h2>
              <p
                className={`mt-1 text-sm leading-6 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
              >
                Please fill out the form below accurately. All fields are
                required, and a valid document is compulsory for verification.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                {/* Applicant Name */}
                <motion.div className="sm:col-span-4" {...fadeInUp}>
                  <label
                    htmlFor="applicantName"
                    className={`block text-sm font-medium leading-6 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}
                  >
                    Lawyers Name
                  </label>
                  <div className="mt-2">
                    <input
                      id="applicantName"
                      name="name"
                      type="text"
                      placeholder="Enter Your name"
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ${theme === "dark" ? "bg-gray-700 text-gray-300 ring-gray-600 focus:ring-indigo-500" : "bg-white text-gray-900 ring-gray-300 focus:ring-indigo-600"} sm:text-sm sm:leading-6`}
                    />
                  </div>
                </motion.div>

                {/* Email */}
                <motion.div className="sm:col-span-4" {...fadeInUp}>
                  <label
                    htmlFor="caseNumber"
                    className={`block text-sm font-medium leading-6 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}
                  >
                    Email
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="text"
                      placeholder="enter email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ${theme === "dark" ? "bg-gray-700 text-gray-300 ring-gray-600 focus:ring-indigo-500" : "bg-white text-gray-900 ring-gray-300 focus:ring-indigo-600"} sm:text-sm sm:leading-6`}
                    />
                  </div>
                </motion.div>

                {/* Contact */}
                <motion.div className="sm:col-span-4" {...fadeInUp}>
                  <label
                    htmlFor="contact"
                    className={`block text-sm font-medium leading-6 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}
                  >
                    Contact No
                  </label>
                  <div className="mt-2">
                    <input
                      id="contact"
                      name="contact"
                      type="text"
                      placeholder="enter contact details"
                      value={formData.contact}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ${theme === "dark" ? "bg-gray-700 text-gray-300 ring-gray-600 focus:ring-indigo-500" : "bg-white text-gray-900 ring-gray-300 focus:ring-indigo-600"} sm:text-sm sm:leading-6`}
                    />
                  </div>
                </motion.div>

                {/* Date of Birth*/}
                <motion.div className="sm:col-span-4" {...fadeInUp}>
                  <label
                    htmlFor="DOB"
                    className={`block text-sm font-medium leading-6 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}
                  >
                    Date Of Birth
                  </label>
                  <div className="mt-2">
                    <input
                      id="dateofbirth"
                      name="dateOfBirth"
                      type="date"
                      placeholder="enter DOB "
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ${theme === "dark" ? "bg-gray-700 text-gray-300 ring-gray-600 focus:ring-indigo-500" : "bg-white text-gray-900 ring-gray-300 focus:ring-indigo-600"} sm:text-sm sm:leading-6`}
                    />
                  </div>
                </motion.div>

                {/* Bar Registration No */}
                <motion.div className="sm:col-span-4" {...fadeInUp}>
                  <label
                    htmlFor="barRegistrationNumber"
                    className={`block text-sm font-medium leading-6 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}
                  >
                    Enter Bar Registration Number
                  </label>
                  <div className="mt-2">
                    <input
                      id="barRegistrationNumber"
                      name="barRegistrationNumber"
                      type="text"
                      placeholder="enter location"
                      value={formData.barRegistrationNumber}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ${theme === "dark" ? "bg-gray-700 text-gray-300 ring-gray-600 focus:ring-indigo-500" : "bg-white text-gray-900 ring-gray-300 focus:ring-indigo-600"} sm:text-sm sm:leading-6`}
                    />
                  </div>
                </motion.div>

                {/* Cases Solved */}
                <motion.div className="sm:col-span-4" {...fadeInUp}>
                  <label
                    htmlFor="casesSolved"
                    className={`block text-sm font-medium leading-6 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}
                  >
                    Cases Solved
                  </label>
                  <div className="mt-2">
                    <input
                      id="casesSolved"
                      name="casesSolved"
                      type="text"
                      placeholder="Enter the crime"
                      value={formData.casesSolved}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ${theme === "dark" ? "bg-gray-700 text-gray-300 ring-gray-600 focus:ring-indigo-500" : "bg-white text-gray-900 ring-gray-300 focus:ring-indigo-600"} sm:text-sm sm:leading-6`}
                    />
                  </div>
                </motion.div>
                {/* specializations  */}
                <motion.div className="sm:col-span-4" {...fadeInUp}>
                  <label
                    htmlFor="securityQuestion"
                    className={`block text-sm font-medium leading-6 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}
                  >
                    Enter specializations
                  </label>
                  <div className="mt-2">
                    <input
                      id="specializations"
                      name="specializations"
                      type="text"
                      placeholder="Enter Specializations"
                      value={formData.specializations}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ${theme === "dark" ? "bg-gray-700 text-gray-300 ring-gray-600 focus:ring-indigo-500" : "bg-white text-gray-900 ring-gray-300 focus:ring-indigo-600"} sm:text-sm sm:leading-6`}
                    />
                  </div>
                </motion.div>

                {/* License Verified */}

                <motion.div className="sm:col-span-4" {...fadeInUp}>
                  <label
                    htmlFor="emergencyContact"
                    className={`block text-sm font-medium leading-6 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}
                  >
                    Enter Licence No
                  </label>
                  <div className="mt-2">
                    <input
                      id="licenseVerified"
                      name="licenseVerified"
                      type="text"
                      placeholder="Enter emergencyContact"
                      value={formData.licenseVerified}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ${theme === "dark" ? "bg-gray-700 text-gray-300 ring-gray-600 focus:ring-indigo-500" : "bg-white text-gray-900 ring-gray-300 focus:ring-indigo-600"} sm:text-sm sm:leading-6`}
                    />
                  </div>
                </motion.div>

                {/* Availability */}
                <motion.div className="sm:col-span-4" {...fadeInUp}>
                  <label
                    htmlFor="inmateStatus"
                    className={`block text-sm font-medium leading-6 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}
                  >
                    Availability
                  </label>
                  <div className="mt-2">
                    <input
                      id="availability"
                      name="availability"
                      type="text"
                      placeholder="Enter availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ${theme === "dark" ? "bg-gray-700 text-gray-300 ring-gray-600 focus:ring-indigo-500" : "bg-white text-gray-900 ring-gray-300 focus:ring-indigo-600"} sm:text-sm sm:leading-6`}
                    />
                  </div>
                </motion.div>

                {/* Additional Information */}
                <motion.div className="sm:col-span-6" {...fadeInUp}>
                  <label
                    htmlFor="additionalInfo"
                    className={`block text-sm font-medium leading-6 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}
                  >
                    Additional Information
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="additionalInfo"
                      name="additionalInfo"
                      placeholder="Provide any other relevant details..."
                      value={formData.additionalInfo}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ${theme === "dark" ? "bg-gray-700 text-gray-300 ring-gray-600 focus:ring-indigo-500" : "bg-white text-gray-900 ring-gray-300 focus:ring-indigo-600"} sm:text-sm sm:leading-6`}
                    />
                  </div>
                </motion.div>

                {/* File Upload */}
                <motion.div className="sm:col-span-6" {...fadeInUp}>
                  <label
                    htmlFor="file"
                    className={`block text-sm font-medium leading-6 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}
                  >
                    Upload Document
                  </label>
                  <div className="mt-2">
                    <input
                      id="file"
                      name="file"
                      type="file"
                      onChange={handleFileChange}
                      className={`block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-indigo-700`}
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div className="mt-6" {...fadeInUp}>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex w-full justify-center rounded-md border border-transparent ${isSubmitting ? "cursor-not-allowed bg-gray-500" : "bg-indigo-600"} px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
              >
                {isSubmitting ? "Submitting..." : "Update Profile"}
              </button>
            </motion.div>
          </motion.div>
        </form>
      </div>
      <ToastContainer />
    </div>

  );
};

export default LawyerForm;
