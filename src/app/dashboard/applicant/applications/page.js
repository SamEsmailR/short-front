// src/app/dashboard/applicant/applications/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { applicationAPI } from '@/lib/api';

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await applicationAPI.getMyApplications();
        setApplications(response.data.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch applications:', err);
        setError('Failed to load applications. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Pending</span>;
      case 'reviewed':
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">Reviewed</span>;
      case 'shortlisted':
        return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Shortlisted</span>;
      case 'rejected':
        return <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">Rejected</span>;
      case 'hired':
        return <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">Hired</span>;
      default:
        return null;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Applications</h1>
      
      <Card>
        <h2 className="text-lg font-medium text-white mb-4">Application History</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">You haven't applied to any jobs yet.</p>
            <Link href="/dashboard/applicant/jobs">
              <Button variant="primary">Browse Jobs</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-dark-100">
              <thead className="bg-dark-300">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Job
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Company
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Applied On
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Match
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-dark-200 divide-y divide-dark-100">
                {applications.map((application) => (
                  <tr key={application._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{application.job.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{application.job.company.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{new Date(application.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(application.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {application.aiScore !== undefined ? (
                        <div className="text-sm font-medium text-primary-500">{application.aiScore}%</div>
                      ) : (
                        <div className="text-sm text-gray-400">N/A</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Link 
                        href={`/dashboard/applicant/jobs/${application.job._id}`}
                        className="text-primary-500 hover:text-primary-400 text-sm font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}