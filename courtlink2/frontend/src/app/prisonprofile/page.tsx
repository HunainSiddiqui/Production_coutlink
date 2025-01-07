"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { BACKEND_URL } from "../config";

const UndertrialProfile = () => {
  const [prisoner, setPrisoner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
      .get(`${BACKEND_URL}/api/v1/prisoner/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setPrisoner(response.data.prisoner);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch prisoner data.");
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
    <div className="container mx-auto mt-20 px-4 py-6">
      <div className="overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800">
        <div className="relative h-48 w-full md:h-64">
          <Image
            src="/images/cover/coverimg.jpg"
            alt="Undertrial Prisoner Cover"
            fill
            className="object-cover object-center"
          />
        </div>

        <div className="px-4 py-6 md:px-6">
          <div className="flex flex-col items-center space-y-4 md:flex-row md:items-start md:space-x-6 md:space-y-0">
            <div className="relative h-32 w-32 rounded-full border-4 border-white shadow-lg dark:border-gray-700 md:h-40 md:w-40">
              <Image
                src="/images/hero/profile.png"
                alt="Undertrial Prisoner"
                fill
                className="rounded-full object-cover"
              />
            </div>

            <div className="flex-grow text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {prisoner.name}
              </h2>
              <div className="mt-2 text-gray-600 dark:text-gray-300">
                <p>Undertrial Prisoner</p>
                <p>Case Number: {prisoner.caseId}</p>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4 rounded-lg bg-gray-100 p-4 dark:bg-gray-700">
                <div className="text-center">
                  <span className="block text-lg font-bold text-gray-800 dark:text-white">
                    {prisoner.inmateStatus}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Status
                  </span>
                </div>
                <div className="text-center">
                  <span className="block text-lg font-bold text-gray-800 dark:text-white">
                    {prisoner.prisonLocation}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Location
                  </span>
                </div>
                <div className="text-center">
                  <span className="block text-lg font-bold text-gray-800 dark:text-white">
                    {new Date(prisoner.dateOfBirth).toLocaleDateString()}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    DOB
                  </span>
                </div>
              </div>

              <div className="mt-6 flex justify-center md:justify-start">
                <button
                  onClick={() => (window.location.href = "/myrequests")} // Adjust the path as per your routing setup
                  className="rounded-lg bg-purple-600 px-6 py-3 text-white shadow hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  My Requests
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-4 border-b pb-2 text-xl font-semibold">
                Personal Information
              </h3>
              <div className="space-y-3">
                <div>
                  <strong className="text-gray-600 dark:text-gray-300">
                    Email:
                  </strong>
                  <span className="ml-2">{prisoner.email}</span>
                </div>
                <div>
                  <strong className="text-gray-600 dark:text-gray-300">
                    Emergency Contact:
                  </strong>
                  <span className="ml-2">{prisoner.emergencyContact}</span>
                </div>
                <div>
                  <strong className="text-gray-600 dark:text-gray-300">
                    Language:
                  </strong>
                  <span className="ml-2">{prisoner.languagePreference}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-4 border-b pb-2 text-xl font-semibold">
                Legal Information
              </h3>
              <div className="space-y-3">
                <div>
                  <strong className="text-gray-600 dark:text-gray-300">
                    Crime:
                  </strong>
                  <span className="ml-2">{prisoner.crime}</span>
                </div>
                <div>
                  <strong className="text-gray-600 dark:text-gray-300">
                    Case ID:
                  </strong>
                  <span className="ml-2">{prisoner.caseId}</span>
                </div>
                <div>
                  <strong className="text-gray-600 dark:text-gray-300">
                    Medical Info:
                  </strong>
                  <span className="ml-2">{prisoner.medicalInfo}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
            <p className="text-sm italic text-gray-600 dark:text-gray-300">
              Note: This information is based on available records and is
              subject to legal proceedings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UndertrialProfile;
