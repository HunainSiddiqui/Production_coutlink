'use client'; // Mark as Client Component

import React, { use, useState ,useEffect } from "react";
import {
  FaSearch,
  FaEnvelope,
  FaPhone,
  FaBriefcase,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BACKEND_URL } from "../config";

//     {
//       name: "John Doe",
//       email: "john.doe@example.com",
//       contact: "+1 234 567 890",
//       barRegistrationNumber: "123456",
//       casesSolved: 120,
//       specializations: "Family Law, Criminal Defense",
//       availability: "Available",
//     },
//     {
//       name: "Jane Smith",
//       email: "jane.smith@example.com",
//       contact: "+1 987 654 321",
//       barRegistrationNumber: "654321",
//       casesSolved: 95,
//       specializations: "Corporate Law, Contract Law",
//       availability: "Unavailable",
//     },
//     {
//       name: "Michael Johnson",
//       email: "michael.johnson@example.com",
//       contact: "+1 234 567 123",
//       barRegistrationNumber: "234567",
//       casesSolved: 150,
//       specializations: "Intellectual Property, Patent Law",
//       availability: "Available",
//     },
//     {
//       name: "Emily Davis",
//       email: "emily.davis@example.com",
//       contact: "+1 345 678 234",
//       barRegistrationNumber: "345678",
//       casesSolved: 80,
//       specializations: "Employment Law, Labor Law",
//       availability: "Available",
//     },
//     {
//       name: "Chris Brown",
//       email: "chris.brown@example.com",
//       contact: "+1 456 789 345",
//       barRegistrationNumber: "456789",
//       casesSolved: 200,
//       specializations: "Civil Litigation, Personal Injury",
//       availability: "Unavailable",
//     },
//     {
//       name: "Sarah Williams",
//       email: "sarah.williams@example.com",
//       contact: "+1 567 890 456",
//       barRegistrationNumber: "567890",
//       casesSolved: 50,
//       specializations: "Real Estate Law, Property Law",
//       availability: "Available",
//     },
//     {
//       name: "David Martinez",
//       email: "david.martinez@example.com",
//       contact: "+1 678 901 567",
//       barRegistrationNumber: "678901",
//       casesSolved: 175,
//       specializations: "Business Law, Tax Law",
//       availability: "Available",
//     },
//     {
//       name: "Olivia Taylor",
//       email: "olivia.taylor@example.com",
//       contact: "+1 789 012 678",
//       barRegistrationNumber: "789012",
//       casesSolved: 110,
//       specializations: "Immigration Law, International Law",
//       availability: "Unavailable",
//     },
//     {
//       name: "Daniel Harris",
//       email: "daniel.harris@example.com",
//       contact: "+1 890 123 789",
//       barRegistrationNumber: "890123",
//       casesSolved: 190,
//       specializations: "Criminal Defense, DUI Defense",
//       availability: "Available",
//     },
//     {
//       name: "Sophia Clark",
//       email: "sophia.clark@example.com",
//       contact: "+1 901 234 890",
//       barRegistrationNumber: "901234",
//       casesSolved: 135,
//       specializations: "Family Law, Divorce Law",
//       availability: "Unavailable",
//     },
//   ];
export default function LawyerListing() {
  const [searchTerm, setSearchTerm] = useState("");
  const [lawyersData, setLawyersData] = useState([]);
  const router = useRouter();

  // Helper function to get the token
  const getToken = () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));
    return token ? token.split("=")[1] : null;
  };

  useEffect(() => {
    const tokenValue = getToken();

    if (!tokenValue) {
      console.error("Authentication token not found.");
      return;
    }

    async function getLawyers() {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/v1/lawyer/all`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenValue}`,
          },
        });
        const lawyersData = res.data.lawyers;
        setLawyersData(lawyersData);
      } catch (error) {
        console.error("Error fetching lawyers data:", error);
      }
    }

    getLawyers();
  }, []); // Ensure this runs on mount

  const handleContactClick = (lawyerId) => {
    console.log("Lawyer ID clicked:", lawyerId); // Log the ID to confirm it works
    router.push(`/addinfo?lawyerId=${lawyerId}`); // Redirect with lawyerId in query params
  };

  // Filter lawyers based on search term (name, email, or specialization)
  const filteredLawyers = lawyersData.filter(
    (lawyer) =>
      lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lawyer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lawyer.specializations.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 pt-24 text-white">
      <div className="py-8 text-center">
        <h1 className="text-4xl font-bold">
          Find Your <span className="text-blue-500">Lawyer</span>
        </h1>
        <p className="mt-2 text-gray-400">
          Search and contact the best lawyers for your needs
        </p>
      </div>

      {/* Search Bar */}
      <div className="container mx-auto mb-8 px-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Lawyers by name, email, or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 p-4 pl-12 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute left-4 top-4 text-gray-500" size={20} />
        </div>
      </div>

      {/* Lawyer Cards */}
      <div className="container mx-auto grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredLawyers.map((lawyer, index) => (
          <div
            key={index}
            className="transform rounded-lg bg-gray-800 p-6 shadow-md transition-transform hover:scale-105 hover:shadow-lg"
          >
            <h3 className="mb-2 text-xl font-semibold text-blue-400">
              {lawyer.name}
            </h3>
            <p className="mb-1 flex items-center text-sm text-gray-400">
              <FaEnvelope className="mr-2" /> {lawyer.email}
            </p>
            <p className="mb-1 flex items-center text-sm text-gray-400">
              <FaPhone className="mr-2" /> {lawyer.contacts}
            </p>
            <p className="mb-1 flex items-center text-sm text-gray-400">
              <FaBriefcase className="mr-2" /> Bar Registration:{" "}
              {lawyer.barRegistrationNumber}
            </p>
            <p className="mb-1 flex items-center text-sm text-gray-400">
              <FaCheckCircle className="mr-2" /> Cases Solved:{" "}
              {lawyer.casesSolved}
            </p>
            <p className="mb-1 text-sm text-gray-400">
              Specializations: {lawyer.specializations}
            </p>
            <p
              className={`mb-3 flex items-center text-sm ${
                lawyer.availability === "Available"
                  ? "text-green-400"
                  : "text-green-400"
              }`}
            >
              {lawyer.availability === "Available" ? (
                <>
                  <FaCheckCircle className="mr-2" /> Available
                </>
              ) : (
                <>
                  <FaCheckCircle className="mr-2" /> Available
                </>
              )}
            </p>
            <button
              className="w-full rounded-lg bg-blue-600 p-3 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => handleContactClick(lawyer.id)}
            >
              Contact Lawyer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
