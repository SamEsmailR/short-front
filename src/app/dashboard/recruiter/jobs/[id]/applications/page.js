// src/app/dashboard/recruiter/applications/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { applicationAPI, jobAPI } from '@/lib/api';

export default function RecruiterApplications() {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    jobId: '',
    status: '',
    searchTerm: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch jobs first
        const jobsResponse = await jobAPI.getMyJobs();
        setJobs(jobsResponse.data.data);

        // Get all applications across jobs
        let allApplications = [];
        for (const job of jobsResponse.data.data) {
          const applicationsResponse = await applicationAPI.getJobApplications(job._id);
          // Add job title to each application for easier display
          const applicationsWithJobTitle = applicationsResponse.data.data.map(app => ({
            ...app,
            jobTitle: job.title,
            companyName: job.company.name
          }));
          allApplications = [...allApplications, ...applicationsWithJobTitle];
        }

        setApplications(allApplications);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch applications:', err);
        setError('Failed to load applications. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const filteredApplications = applications.filter((app) => {
    // Filter by job
    if (filters.jobId && app.job._id !== filters.jobId) {
      return false;
    }

    // Filter by status
    if (filters.status && app.status !== filters.status) {
      return false;
    }

    // Filter by search term (applicant name or email)
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      return (
        app.applicant.name.toLowerCase().includes(searchLower) ||
        app.applicant.email.toLowerCase().includes(searchLower) ||
        app.jobTitle.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

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

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await applicationAPI.updateApplicationStatus(applicationId, { status: newStatus });
      
      // Update the local state
      setApplications(applications.map(app => 
        app._id === applicationId ? { ...app, status: newStatus } : app
      ));
    } catch (err) {
      console.error('Failed to update application status:', err);
      alert('Failed to update application status.');
    }
  };

  const handleAnalyze = async (applicationId) => {
    try {
      await applicationAPI.analyzeApplication(applicationId);
      alert('Analysis completed. Refreshing data...');
      
      // Refresh the applications data
      window.location.reload();
    } catch (err) {
      console.error('Failed to analyze application:', err);
      alert('Failed to analyze application.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Applications</h1>
      
      <Card>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-lg font-medium text-white">All Applications</h2>
          
          <div className="flex flex-col md:flex-row gap-3">
            <select
              name="jobId"
              value={filters.jobId}
              onChange={handleFilterChange}
              className="bg-dark-300 border border-dark-100 text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 p-2.5"
            >
              <option value="">All Jobs</option>
              {jobs.map((job) => (
                <option key={job._id} value={job._id}>
                  {job.title}
                </option>
              ))}
            </select>
            
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="bg-dark-300 border border-dark-100 text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 p-2.5"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
              <option value="hired">Hired</option>
            </select>
            
            <input
              type="text"
              name="searchTerm"
              placeholder="Search applicants..."
              value={filters.searchTerm}
              onChange={handleFilterChange}
              className="bg-dark-300 border border-dark-100 text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 p-2.5"
            />
          </div>
        </div>
        
        {filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No applications found.</p>
            <Button 
              variant="secondary"
              onClick={() => setFilters({ jobId: '', status: '', searchTerm: '' })}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-dark-100">
              <thead className="bg-dark-300">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Job
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Match Score
                  </th>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-dark-200 divide-y divide-dark-100">
                {filteredApplications.map((application) => (
                  <tr key={application._id}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
                          <span className="text-white font-medium">
                            {application.applicant.name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{application.applicant.name}</div>
                          <div className="text-sm text-gray-400">{application.applicant.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{application.jobTitle || 'Unknown Job'}</div>
                      <div className="text-xs text-gray-400">{application.companyName || ''}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(application.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {getStatusBadge(application.status)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {application.aiScore ? (
                        <span className="text-primary-500 font-medium">{application.aiScore}%</span>
                      ) : (
                        <span className="text-gray-400">Not analyzed</span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300 text-right">
                      <div className="flex justify-end space-x-2">
                        <Link 
                          href={`/dashboard/recruiter/applications/${application._id}`}
                          className="text-primary-500 hover:text-primary-400"
                        >
                          View
                        </Link>
                        
                        <div className="relative group">
                          <button className="text-gray-400 hover:text-white">
                            Status
                          </button>
                          <div className="absolute right-0 mt-2 w-48 bg-dark-100 rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                            <button
                              className="block px-4 py-2 text-sm text-white hover:bg-dark-200 w-full text-left"
                              onClick={() => handleStatusChange(application._id, 'reviewed')}
                            >
                              Mark as Reviewed
                            </button>
                            <button
                              className="block px-4 py-2 text-sm text-white hover:bg-dark-200 w-full text-left"
                              onClick={() => handleStatusChange(application._id, 'shortlisted')}
                            >
                              Shortlist
                            </button>
                            <button
                              className="block px-4 py-2 text-sm text-white hover:bg-dark-200 w-full text-left"
                              onClick={() => handleStatusChange(application._id, 'rejected')}
                            >
                              Reject
                            </button>
                            <button
                              className="block px-4 py-2 text-sm text-white hover:bg-dark-200 w-full text-left"
                              onClick={() => handleStatusChange(application._id, 'hired')}
                            >
                              Mark as Hired
                            </button>
                          </div>
                        </div>
                        
                        {!application.aiScore && (
                          <button
                            className="text-blue-500 hover:text-blue-400"
                            onClick={() => handleAnalyze(application._id)}
                          >
                            Analyze
                          </button>
                        )}
                      </div>
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