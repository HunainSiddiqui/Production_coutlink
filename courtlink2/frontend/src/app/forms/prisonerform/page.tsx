"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "react-circular-progressbar/dist/styles.css";
import { BACKEND_URL } from "../../config";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import { Router } from "next/router";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const PrisonerForm = () => {
  const Router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    prisonerId: "",
    dateOfBirth: "",
    prisonLocation: "",
    crime:"",
    securityQuestion: "",
    emergencyContact: "",
    inmateStatus: "",
    caseId: "",
    languagePreference: "",
    medicalInfo: "",
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

    setIsSubmitting(true);
    if (
      !formData.name ||
      !formData.email ||
      !formData.prisonerId ||
      !formData.dateOfBirth ||
      !formData.prisonLocation ||
      !formData.securityQuestion ||
      !formData.emergencyContact ||
      !formData.inmateStatus ||
      !formData.caseId ||
      !formData.languagePreference ||
      !formData.medicalInfo ||
      !formData.additionalInfo
    ) {
      alert("Please fill out all required fields.");
      setIsSubmitting(false);
      return;
    }
    //  Token
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="));

    if (!token) {
      toast.error("Token not found. Please log in again.");
      return;
    }

    const tokenValue = token.split("=")[1];

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/v1/forms/prisonerform`,
        {
          name: formData.name,
          email: formData.email,
          prisonerId: formData.prisonerId,
          dateOfBirth: formData.dateOfBirth,
          prisonLocation: formData.prisonLocation,
          crime: formData.crime,
          securityQuestion: formData.securityQuestion,
          emergencyContact: formData.emergencyContact,
          inmateStatus: formData.inmateStatus,
          caseId: formData.caseId,
          languagePreference: formData.languagePreference,
          medicalInfo: formData.medicalInfo,
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
        Router.push("/prisonprofile");
      } else {
        toast.error("Unable to submit application. Please try again.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Error during Applicatiopn. Please try again.";

      toast.error("Error during signup:", errorMessage);
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
                Update Prisoners Profile
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
                    Prisoners Name
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

                {/*  Prisoner's Id */}
                <motion.div className="sm:col-span-4" {...fadeInUp}>
                  <label
                    htmlFor="Prisoner's Id"
                    className={`block text-sm font-medium leading-6 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}
                  >
                    Prisoners Id
                  </label>
                  <div className="mt-2">
                    <input
                      id="prisonerid"
                      name="prisonerId"
                      type="text"
                      placeholder="enter prisonerId"
                      autoComplete="prisonerId"
                      value={formData.prisonerId}
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

                {/* Prison Location */}
                <motion.div className="sm:col-span-4" {...fadeInUp}>
                  <label
                    htmlFor="address"
                    className={`block text-sm font-medium leading-6 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}
                  >
                    Prison Location
                  </label>
                  <div className="mt-2">
                    <input
                      id="prisonLocation"
                      name="prisonLocation"
                      type="text"
                      placeholder="enter location"
                      value={formData.prisonLocation}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ${theme === "dark" ? "bg-gray-700 text-gray-300 ring-gray-600 focus:ring-indigo-500" : "bg-white text-gray-900 ring-gray-300 focus:ring-indigo-600"} sm:text-sm sm:leading-6`}
                    />
                  </div>
                </motion.div>

                {/* Crime */}
                <motion.div className="sm:col-span-4" {...fadeInUp}>
                  <label
                    htmlFor="crime"
                    className={`block text-sm font-medium leading-6 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}
                  >
                    Crime
                  </label>
                  <div className="mt-2">
                    <input
                      id="crime"
                      name="crime"
                      type="text"
                      placeholder="Enter the crime"
                      value={formData.crime}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ${theme === "dark" ? "bg-gray-700 text-gray-300 ring-gray-600 focus:ring-indigo-500" : "bg-white text-gray-900 ring-gray-300 focus:ring-indigo-600"} sm:text-sm sm:leading-6`}
                    />
                  </div>
                </motion.div>
                {/* Security Questions */}
                <motion.div className="sm:col-span-4" {...fadeInUp}>
                  <label
                    htmlFor="securityQuestion"
                    className={`block text-sm font-medium leading-6 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}
                  >
                    Enter Security Questions
                  </label>
                  <div className="mt-2">
                    <input
                      id="securityQuestion"
                      name="securityQuestion"
                      type="text"
                      placeholder="123 Main St, City, Country"
                      value={formData.securityQuestion}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ${theme === "dark" ? "bg-gray-700 text-gray-300 ring-gray-600 focus:ring-indigo-500" : "bg-white text-gray-900 ring-gray-300 focus:ring-indigo-600"} sm:text-sm sm:leading-6`}
                    />
                  </div>
                </motion.div>
                {/* emergencyContact */}
                <motion.div className="sm:col-span-4" {...fadeInUp}>
                  <label
                    htmlFor="emergencyContact"
                    className={`block text-sm font-medium leading-6 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}
                  >
                    Emergency Contact
                  </label>
                  <div className="mt-2">
                    <input
                      id="emergencyContact"
                      name="emergencyContact"
                      type="text"
                      placeholder="Enter emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ${theme === "dark" ? "bg-gray-700 text-gray-300 ring-gray-600 focus:ring-indigo-500" : "bg-white text-gray-900 ring-gray-300 focus:ring-indigo-600"} sm:text-sm sm:leading-6`}
                    />
                  </div>
                </motion.div>

                {/* inmateStatus */}
                <motion.div className="sm:col-span-4" {...fadeInUp}>
                  <label
                    htmlFor="inmateStatus"
                    className={`block text-sm font-medium leading-6 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}
                  >
                    Inmate Status
                  </label>
                  <div className="mt-2">
                    <input
                      id="inmateStatus"
                      name="inmateStatus"
                      type="text"
                      placeholder="Enter inmate Status"
                      value={formData.inmateStatus}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ${theme === "dark" ? "bg-gray-700 text-gray-300 ring-gray-600 focus:ring-indigo-500" : "bg-white text-gray-900 ring-gray-300 focus:ring-indigo-600"} sm:text-sm sm:leading-6`}
                    />
                  </div>
                </motion.div>
                {/* Case Id */}
                <motion.div className="sm:col-span-4" {...fadeInUp}>
                  <label
                    htmlFor="caseId"
                    className={`block text-sm font-medium leading-6 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}
                  >
                    Case Id
                  </label>
                  <div className="mt-2">
                    <input
                      id="caseId"
                      name="caseId"
                      type="text"
                      placeholder="Enter caseId"
                      value={formData.caseId}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ${theme === "dark" ? "bg-gray-700 text-gray-300 ring-gray-600 focus:ring-indigo-500" : "bg-white text-gray-900 ring-gray-300 focus:ring-indigo-600"} sm:text-sm sm:leading-6`}
                    />
                  </div>
                </motion.div>

                {/* Language Preference */}
                <motion.div className="sm:col-span-4" {...fadeInUp}>
                  <label
                    htmlFor="languagePreference"
                    className={`block text-sm font-medium leading-6 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}
                  >
                    Language Preference
                  </label>
                  <div className="mt-2">
                    <input
                      id="languagePreference"
                      name="languagePreference"
                      type="text"
                      placeholder="Enter languagePreferences"
                      value={formData.languagePreference}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ${theme === "dark" ? "bg-gray-700 text-gray-300 ring-gray-600 focus:ring-indigo-500" : "bg-white text-gray-900 ring-gray-300 focus:ring-indigo-600"} sm:text-sm sm:leading-6`}
                    />
                  </div>
                </motion.div>

                {/* Medical Info */}
                <motion.div className="sm:col-span-4" {...fadeInUp}>
                  <label
                    htmlFor="medicalInfo"
                    className={`block text-sm font-medium leading-6 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}
                  >
                    Medical Info
                  </label>
                  <div className="mt-2">
                    <input
                      id="medicalInfo"
                      name="medicalInfo"
                      type="text"
                      placeholder="Enter medical Info"
                      value={formData.medicalInfo}
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

export default PrisonerForm;
