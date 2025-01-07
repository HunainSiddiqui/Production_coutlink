"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { BACKEND_URL } from "../config";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Shield, FileText, Scale, Upload, Landmark } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const BailApplicationPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    applicantName: "",
    caseNumber: "",
    email: "",
    address: "",
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

    // Form validation
    if (
      !formData.applicantName ||
      !formData.caseNumber ||
      !formData.email ||
      !formData.address ||
      !formData.additionalInfo
    ) {
      toast.error("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);

    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      .split("=")[1];

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/v1/bail`,
        {
          applicantName: formData.applicantName,
          caseNumber: formData.caseNumber,
          email: formData.email,
          address: formData.address,
          additionalInfo: formData.additionalInfo,
          file: formData.file,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.status === 201) {
        setProgress(25);
        await generatePDF();
        toast.success("Application submitted successfully!");
        router.push("/dashboard"); // Redirect after successful submission
      } else {
        toast.error("Unable to submit application. Please try again.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Error during Application. Please try again.";
      toast.error(errorMessage);
      console.error("Error during signup:", error);
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

  const generatePDF = async () => {
    const doc = new jsPDF();
    try {
      doc.setFillColor(255, 255, 255);
      doc.circle(20, 20, 15, "F");

      doc.setFontSize(18);
      doc.text("Ministry of Law & Justice", 40, 15);
      doc.text("Department of Justice", 40, 25);
      doc.text("Bail Application", 40, 35);

      // Body content
      doc.setFontSize(12);
      doc.text(`To,`, 20, 50);
      doc.text(`The Honorable Court`, 20, 60);
      doc.text(
        `Subject: Bail Application for the case No. ${formData.caseNumber}`,
        20,
        70,
      );
      doc.text(`Respected Sir/Madam,`, 20, 80);

      // Application content in letter format
      const letterContent = `I, ${formData.applicantName}, respectfully submit this application requesting bail in the case registered against me, bearing case number ${formData.caseNumber}. 
  
  I am currently residing at ${formData.address}. I am a law-abiding citizen, and I have no intentions to evade the law. I fully intend to cooperate with the judicial process and ensure that I attend all court hearings and fulfill any obligations placed upon me during this legal proceeding.
  
  ${formData.additionalInfo ? `Additional Information: ${formData.additionalInfo}` : ""}
  
  I humbly request the court to consider granting me bail as I am willing to abide by all conditions that the court may impose upon me. I assure the court that I will not misuse the bail in any manner, nor will I attempt to leave the jurisdiction.
  
  Thank you for considering my application. I look forward to your kind and just decision in this matter.
  
  Sincerely,
  ${formData.applicantName}
  Contact: ${formData.email}`;

      // Split letterContent into lines for fitting in PDF
      const lines = doc.splitTextToSize(letterContent, 170);

      doc.text(lines, 20, 90);

      // Footer with page numbers
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: "center" },
        );
      }

      // Save the PDF
      doc.save("BailApplicationForm.pdf");
    } catch (error) {
      console.error("Error generating PDF: ", error);
      toast.error("Error generating PDF.");
    }
  };

  return (
    <div
      className={`mt-20 flex  min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8 ${theme === "dark" ? "bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200" : "bg-gray-100 text-gray-900"}`}
    >
      <div
        className={`relative w-full max-w-4xl space-y-8 rounded-2xl border p-10 shadow-2xl ${theme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}
      >
        {/* Government Header Section */}
        <div className="absolute left-0 right-0 top-0 flex h-24 items-center justify-center rounded-t-2xl bg-indigo-900">
          <div className="flex items-center space-x-4">
            <Landmark className="text-white" size={40} />
            <div>
              <h1 className="text-2xl font-bold text-white font-serif">
                Ministry of Law & Justice
              </h1>
              <p className="text-sm text-indigo-200">Government of India</p>
            </div>
          </div>
        </div>

        {/* Main Form Container */}
        <div className="pt-20 font-serif">
          <motion.div className="mb-6 flex items-center space-x-4">
            <Scale className="text-indigo-500" size={32} />
            <h2
              className={`text-2xl font-semibold ${theme === "dark" ? "text-gray-100" : "text-gray-900 "}`}
            >
              Bail Application Form
            </h2>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <motion.div
              className="space-y-12"
              initial="initial"
              animate="animate"
            >
              <motion.div
                className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"
                {...fadeInUp}
              >
                {/* Applicant Name */}
                <motion.div className="sm:col-span-4" {...fadeInUp}>
                  <label
                    htmlFor="applicantName"
                    className={`block text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}
                  >
                    Applicant Name
                  </label>
                  <div className="mt-2">
                    <input
                      id="applicantName"
                      name="applicantName"
                      type="text"
                      placeholder="Enter Full Name"
                      value={formData.applicantName}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border-2 px-3 py-2 transition-all duration-300 ${
                        theme === "dark"
                          ? "border-gray-600 bg-gray-700 text-gray-200 focus:border-indigo-500"
                          : "border-gray-300 bg-white text-gray-900 focus:border-indigo-500"
                      }`}
                      required
                    />
                  </div>
                </motion.div>

                {/* Case Number */}
                <motion.div className="sm:col-span-4" {...fadeInUp}>
                  <label
                    htmlFor="caseNumber"
                    className={`block text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}
                  >
                    Case Number
                  </label>
                  <div className="mt-2">
                    <input
                      id="caseNumber"
                      name="caseNumber"
                      type="text"
                      placeholder="Enter Case Number"
                      value={formData.caseNumber}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border-2 px-3 py-2 transition-all duration-300 ${
                        theme === "dark"
                          ? "border-gray-600 bg-gray-700 text-gray-200 focus:border-indigo-500"
                          : "border-gray-300 bg-white text-gray-900 focus:border-indigo-500"
                      }`}
                      required
                    />
                  </div>
                </motion.div>

                {/* Email */}
                <motion.div className="sm:col-span-4" {...fadeInUp}>
                  <label
                    htmlFor="email"
                    className={`block text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}
                  >
                    Email Address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border-2 px-3 py-2 transition-all duration-300 ${
                        theme === "dark"
                          ? "border-gray-600 bg-gray-700 text-gray-200 focus:border-indigo-500"
                          : "border-gray-300 bg-white text-gray-900 focus:border-indigo-500"
                      }`}
                      required
                    />
                  </div>
                </motion.div>

                {/* Address */}
                <motion.div className="sm:col-span-4" {...fadeInUp}>
                  <label
                    htmlFor="address"
                    className={`block text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}
                  >
                    Residential Address
                  </label>
                  <div className="mt-2">
                    <input
                      id="address"
                      name="address"
                      type="text"
                      placeholder="Enter Full Residential Address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border-2 px-3 py-2 transition-all duration-300 ${
                        theme === "dark"
                          ? "border-gray-600 bg-gray-700 text-gray-200 focus:border-indigo-500"
                          : "border-gray-300 bg-white text-gray-900 focus:border-indigo-500"
                      }`}
                      required
                    />
                  </div>
                </motion.div>

                {/* Additional Information */}
                <motion.div className="sm:col-span-6" {...fadeInUp}>
                  <label
                    htmlFor="additionalInfo"
                    className={`block text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}
                  >
                    Additional Information
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="additionalInfo"
                      name="additionalInfo"
                      placeholder="Provide any additional relevant details"
                      value={formData.additionalInfo}
                      onChange={handleInputChange}
                      rows={4}
                      className={`w-full rounded-lg border-2 px-3 py-2 transition-all duration-300 ${
                        theme === "dark"
                          ? "border-gray-600 bg-gray-700 text-gray-200 focus:border-indigo-500"
                          : "border-gray-300 bg-white text-gray-900 focus:border-indigo-500"
                      }`}
                      required
                    />
                  </div>
                </motion.div>

                {/* File Upload */}
                <motion.div className="sm:col-span-6" {...fadeInUp}>
                  <label
                    htmlFor="file"
                    className={`block text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}
                  >
                    Supporting Documents
                  </label>
                  <div className="mt-2 flex items-center space-x-4">
                    <input
                      id="file"
                      name="file"
                      type="file"
                      onChange={handleFileChange}
                      className={`hidden`}
                    />
                    <label
                      htmlFor="file"
                      className={`flex cursor-pointer items-center space-x-2 rounded-lg px-4 py-2 transition-all duration-300 ${
                        theme === "dark"
                          ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      }`}
                    >
                      <Upload size={20} />
                      <span>
                        {formData.file ? formData.file.name : "Upload Document"}
                      </span>
                    </label>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div className="mt-8" {...fadeInUp}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex w-full items-center justify-center space-x-2 rounded-lg py-3 font-semibold text-white transition-all duration-300 ${
                    isSubmitting
                      ? "cursor-not-allowed bg-gray-500"
                      : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg"
                  }`}
                >
                  <FileText size={20} />
                  <span>
                    {isSubmitting
                      ? "Submitting Application..."
                      : "Submit Application"}
                  </span>
                </button>
              </motion.div>
            </motion.div>
          </form>
        </div>

        {/* Footer with Official Disclaimer */}
        <div
          className={`mt-8 rounded-lg p-4 text-center text-sm ${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-600"}`}
        >
          <Shield className="mx-auto mb-2 text-indigo-500" size={24} />
          <p>
            This is an official government form. Providing false information is
            punishable under law. All information will be treated as
            confidential.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BailApplicationPage;
