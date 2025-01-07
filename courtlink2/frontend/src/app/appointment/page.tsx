"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  Check,
  X,
  AlertTriangle,
  Clock,
  Scale,
  User,
  FileText,
  Phone,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_URL } from "../config";

const AppointmentRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));

    const tokenValue = token.split("=")[1];

    axios
      .get(`${BACKEND_URL}/api/v1/lawyer/requests`, {
        headers: {
          Authorization: `Bearer ${tokenValue}`,
        },
      })
      .then((response) => {
        setRequests(response.data.requests);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch appointment requests.");
        setLoading(false);
      });
  }, []);

  const handleCaseAction = (id, status) => {
    const updatedRequests = requests.map((req) =>
      req.id === id ? { ...req, status } : req,
    );
    setRequests(updatedRequests);
    // alert(`Case #${id} has been ${status.toLowerCase()}.`);

     // Displaying toast notifications
     if (status === "Accepted") {
      toast.success(`Case #${id} has been accepted.`);
    } else if (status === "Rejected") {
      toast.error(`Case #${id} has been rejected.`);
    }


     // Make API call to update status in the backend
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
    .patch(
      `${BACKEND_URL}/api/v1/prisoner/requests/status/${id}`, // Endpoint to update the request status
      { status: status }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => {
      toast.success(`Request status for Case #${id} has been updated.`);
        if (response.data.request.status === "Accepted")  {
         // Send email to the prisoner
         try {
           axios.post(`${BACKEND_URL}/api/v1/chat/create`, {
             userId: response.data.request.prisoner.userId,
           },{
              headers: {
                Authorization: `Bearer ${token}`,
              },
           });
         } catch (err) {
           console.error("Failed to create chat with the prisoner:", err);
           toast.error("Failed to craete chat with the prisoner.");
         }
       }
    })
    .catch((err) => {
      // If there's an error with the API call, show error message
      console.error(err);
      toast.error(`Failed to update status for Case #${id}.`);
    });
  };


  const getUrgencyColor = (level) => {
    switch (level) {
      case "High":
        return "bg-red-500/20 text-red-500 border border-red-500";
      case "Medium":
        return "bg-yellow-500/20 text-yellow-500 border border-yellow-500";
      default:
        return "bg-green-500/20 text-green-500 border border-green-500";
    }
  };

  const filteredRequests =
    filter === "All"
      ? requests
      : requests.filter((req) => req.status === filter);

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
          <p className="text-xl text-red-400">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-950 pt-16 text-gray-200">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="flex items-center font-serif text-3xl font-extrabold text-blue-400">
            <Scale className="mr-3" /> Appointment Requests
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
            <p className="text-xl text-gray-400">
              No appointment requests available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="transform overflow-hidden rounded-xl border border-transparent bg-gray-800 shadow-2xl transition duration-300 hover:scale-105 hover:border-blue-500/50 hover:shadow-2xl"
              >
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="flex items-center text-xl font-bold text-blue-400">
                      <Clock className="mr-2" size={20} /> Case #{request.id}
                    </h2>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getUrgencyColor(request.urgencyLevel)}`}
                    >
                      {request.urgencyLevel}
                    </span>
                  </div>

                  <div className="mb-4 space-y-3">
                    <p className="flex items-center text-gray-300">
                      <User className="mr-2 text-blue-400" size={16} />
                      <strong>Prisoner:</strong> {request.prisoner.name} (ID:{" "}
                      {request.prisonerId})
                    </p>
                    <p className="flex items-center text-gray-300">
                      <User className="mr-2 text-blue-400" size={16} />
                      <strong>Lawyer:</strong> {request.lawyer.name} (ID:{" "}
                      {request.lawyerId})
                    </p>
                    <p className="flex items-center text-gray-300">
                      <FileText className="mr-2 text-blue-400" size={16} />
                      <strong>Case Description:</strong>{" "}
                      {request.caseDescription}
                    </p>
                    <p className="flex items-center text-gray-300">
                      <Phone className="mr-2 text-blue-400" size={16} />
                      <strong>Contact Number:</strong> {request.contactNo}
                    </p>
                    <p className="text-gray-300">
                      <strong>Status:</strong>{" "}
                      <span
                        className={`font-medium ${
                          request.status === "Pending"
                            ? "text-yellow-500"
                            : request.status === "Accepted"
                              ? "text-green-500"
                              : "text-red-500"
                        }`}
                      >
                        {request.status}
                      </span>
                    </p>
                  </div>

                  {request.status === "Pending" && (
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleCaseAction(request.id, "Accepted")}
                        className="flex flex-1 items-center justify-center rounded-md border border-green-500 bg-green-500/20 px-4 py-2 text-green-400 transition hover:bg-green-500/40"
                      >
                        <Check className="mr-2" size={16} /> Accept
                      </button>
                      <button
                        onClick={() => handleCaseAction(request.id, "Rejected")}
                        className="flex flex-1 items-center justify-center rounded-md border border-red-500 bg-red-500/20 px-4 py-2 text-red-400 transition hover:bg-red-500/40"
                      >
                        <X className="mr-2" size={16} /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentRequests;
