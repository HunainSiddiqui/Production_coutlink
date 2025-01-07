"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import {
  Scale,
  AlertTriangle,
  User,
  FileText,
  Clock,
  ArrowUpRight,
  Calendar,
} from "lucide-react";

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));

    if (!token) {
      setError("Authentication token not found. Please log in again.");
      setLoading(false);
      return;
    }

    const tokenValue = token.split("=")[1];

    axios
      .get(`${BACKEND_URL}/api/v1/prisoner/myrequests`, {
        headers: {
          Authorization: `Bearer ${tokenValue}`,
        },
      })
      .then((response) => {
        setRequests(response.data.myrequests);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch requests.");
        setLoading(false);
      });
  }, []);

  const getUrgencyDetails = (level) => {
    switch (level) {
      case "High":
        return {
          color: "bg-red-500/20 text-red-500 border border-red-500",
          icon: <AlertTriangle className="mr-1" size={14} />,
        };
      case "Medium":
        return {
          color: "bg-yellow-500/20 text-yellow-500 border border-yellow-500",
          icon: <Clock className="mr-1" size={14} />,
        };
      default:
        return {
          color: "bg-green-500/20 text-green-500 border border-green-500",
          icon: <Scale className="mr-1" size={14} />,
        };
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-blue-950">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-white/30 border-t-white"></div>
          <p className="text-xl text-white">Loading Requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-blue-950">
        <div className="rounded-xl border border-red-500 bg-red-500/10 p-8 text-center">
          <AlertTriangle className="mx-auto mb-4 text-red-500" size={48} />
          <p className="text-xl text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  const filteredRequests =
    filter === "All"
      ? requests
      : requests.filter((req) => req.status === filter);

  const updateStatus = (requestId, newStatus) => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      setError("Authentication token not found. Please log in again.");
      return;
    }
    axios
      .patch(
        `${BACKEND_URL}/api/v1/prisoner/requests/${requestId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((response) => {
        setRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.id === requestId
              ? { ...request, status: newStatus }
              : request,
          ),
        );
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to update status.");
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-950 pt-16 text-gray-200">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="flex items-center font-serif text-3xl font-extrabold text-blue-400">
            <Scale className="mr-3" /> My Requests
          </h1>

          <div className="flex space-x-2">
            {["All", "Pending", "Accepted", "Rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                  filter === status
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="rounded-xl bg-gray-800 p-12 text-center">
            <FileText className="mx-auto mb-4 text-gray-500" size={48} />
            <p className="text-xl text-gray-400">No requests available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredRequests.map((request) => {
              const urgencyDetails = getUrgencyDetails(request.urgencyLevel);
              return (
                <div
                  key={request.id}
                  className="transform overflow-hidden rounded-xl border border-transparent bg-gray-800 shadow-2xl transition duration-300 hover:scale-105 hover:border-blue-500/50 hover:shadow-2xl"
                >
                  <div className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="flex items-center text-xl font-bold text-blue-300">
                        <User className="mr-2" size={20} />
                        Lawyer name :{request.lawyer.name}
                      </h3>
                      <span
                        className={`flex items-center rounded-full px-3 py-1 text-xs font-semibold ${urgencyDetails.color}`}
                      >
                        {urgencyDetails.icon}
                        {request.urgencyLevel}
                      </span>
                    </div>

                    <div className="mb-4 space-y-3">
                      <p className="flex items-center text-sm text-gray-400">
                        <FileText className="mr-2 text-blue-400" size={16} />
                        <strong>Bar Registration:</strong>
                        <span className="ml-1 text-gray-300">
                          {request.lawyer.barRegistrationNumber}
                        </span>
                      </p>
                      <p className="flex items-center text-sm text-gray-400">
                        <ArrowUpRight
                          className="mr-2 text-blue-400"
                          size={16}
                        />
                        <strong>Email:</strong>
                        <span className="ml-1 text-gray-300">
                          {request.lawyer.email}
                        </span>
                      </p>
                      <p className="flex items-center text-sm text-gray-400">
                        <FileText className="mr-2 text-blue-400" size={16} />
                        <strong>Case Description:</strong>
                        <span className="ml-1 text-gray-300">
                          {request.caseDescription}
                        </span>
                      </p>
                      <p className="flex items-center text-sm text-gray-400">
                        <Calendar className="mr-2 text-blue-400" size={16} />
                        <strong>Submitted:</strong>
                        <span className="ml-1 text-gray-300">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </p>
                      <p className="flex items-center text-sm text-gray-400">
                        <Scale className="mr-2 text-blue-400" size={16} />
                        <strong>Status:</strong>
                        <span
                          className={`ml-1 font-semibold ${
                            request.status === "Accepted"
                              ? "text-green-400"
                              : request.status === "Pending"
                                ? "text-yellow-400"
                                : "text-green-400"
                          }`}
                        >
                          {request.status}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequests;
