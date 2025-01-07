"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { BACKEND_URL } from "../config";

const LawyerProfile = () => {
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Safely access document.cookie in the client-side environment
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      setError("Authentication token not found.");
      setLoading(false);
      return;
    }

    axios
      .get(`${BACKEND_URL}/api/v1/lawyer/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setLawyer(response.data.lawyer);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch lawyer data.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto mt-16 px-4 py-6">
      {/* Profile rendering logic using dynamic data */}
      <div className="overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800">
        {/* Cover Photo Section */}
        <div className="relative h-48 w-full md:h-64">
          <Image
            src="/images/lawyer/lawyer-cover.jpg"
            alt="Lawyer Profile Cover"
            fill
            className="object-cover object-center"
          />
        </div>

        {/* Profile Details */}
        <div className="px-4 py-6 md:px-8 md:py-8">
          <div className="flex flex-col items-center space-y-4 md:flex-row md:items-start md:space-x-6 md:space-y-0">
            <div className="relative h-32 w-32 rounded-full border-4 border-white shadow-lg dark:border-gray-700 md:h-40 md:w-40">
              {/* Replace with dynamic profile photo */}
              <Image
                src="/images/hero/profile.png"
                alt="Lawyer Profile"
                fill
                className="rounded-full object-cover"
              />
            </div>

            {/* Personal Information */}
            <div className="flex-grow text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {lawyer.name}
              </h2>
              <div className="mt-2 text-gray-600 dark:text-gray-300">
                <p>Bar Registration: {lawyer.barRegistrationNumber}</p>
              </div>

              {/* Professional Statistics */}
              <div className="mt-4 grid grid-cols-3 gap-4 rounded-lg bg-gray-100 p-4 dark:bg-gray-700">
                <div className="text-center">
                  <span className="block text-lg font-bold text-gray-800 dark:text-white">
                    {lawyer.casesSolved}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Cases Solved
                  </span>
                </div>
                <div className="text-center">
                  <span className="block text-lg font-bold text-gray-800 dark:text-white">
                    {lawyer.specializations.join(", ")}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Specialization
                  </span>
                </div>
                <div className="text-center">
                  <span className="block text-lg font-bold text-gray-800 dark:text-white">
                    {lawyer.licenseVerified ? "Verified" : "Not Verified"}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    License Status
                  </span>
                </div>
              </div>
              <div className="mt-6 flex justify-center md:justify-start">
                <button
                  onClick={() => (window.location.href = "/appointment")} // Adjust the path as per your routing setup
                  className="rounded-lg bg-purple-600 px-6 py-3 text-white shadow hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  My Appointment Requests
                </button>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-4 border-b pb-2 text-xl font-semibold">
                Personal Information
              </h3>
              <p>Date of Birth: {lawyer.dateOfBirth}</p>
              <p>Contact: {lawyer.contacts}</p>
              <p>Email: {lawyer.email}</p>
            </div>
            <div>
              <h3 className="mb-4 border-b pb-2 text-xl font-semibold">
                Professional Information
              </h3>
              <p>Availability: {lawyer.availability}</p>
              <p>Additional Info: {lawyer.additionalInfo}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawyerProfile;






