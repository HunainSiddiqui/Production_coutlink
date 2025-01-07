'use client'; // For client-side rendering in Next.js app directory

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { BACKEND_URL } from "../../config";


const BailTrackPage = ({ params }) => {
  const [bailRequests, setBailRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('light');
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchBailRequests = async () => {
    
        //get token from cookies
        const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
        alert(token);
      try {
        const res = await axios.get(`${BACKEND_URL}/api/v1/bail-track/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          });
          
        setBailRequests(res.data.requests || []); 
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bail requests:', error);
        setLoading(false);
      }
    };

    fetchBailRequests();
  }, [id]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(mediaQuery.matches ? 'dark' : 'light');

    const handleChange = (e) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const getStatusProgress = (status) => {
    switch (status) {
      case 'Pending':
        return 25;
      case 'In Review':
        return 50;
      case 'Approved':
        return 100;
      case 'Rejected':
        return 0;
      default:
        return 0;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!bailRequests.length) {
    return <div>No bail requests found for this user.</div>;
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'} py-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Bail Request Tracker</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bailRequests.map(request => (
            <div key={request.id} className={`p-6 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">{request.applicantName}</h2>
                <div style={{ width: 50, height: 50 }}>
                  <CircularProgressbar
                    value={getStatusProgress(request.status)}
                    text={`${getStatusProgress(request.status)}%`}
                    styles={buildStyles({
                      textSize: '16px',
                      pathColor: getStatusProgress(request.status) === 100 ? '#4caf50' : '#ff6347',
                      textColor: theme === 'dark' ? '#fff' : '#000',
                      trailColor: theme === 'dark' ? '#374151' : '#d6d6d6',
                    })}
                  />
                </div>
              </div>
              <p className="mb-2"><strong>Case Number:</strong> {request.caseNumber}</p>
              <p className="mb-2"><strong>Email:</strong> {request.email}</p>
              <p className="mb-2"><strong>Address:</strong> {request.address}</p>
              <p className="mb-2"><strong>Status:</strong> {request.status}</p>
              <p className="mb-4"><strong>Additional Info:</strong> {request.additionalInfo}</p>
              <a href={`/completebail/${request.id}`} className="text-indigo-600 hover:text-indigo-900">
                View Details
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BailTrackPage;
