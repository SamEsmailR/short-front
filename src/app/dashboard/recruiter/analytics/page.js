// src/app/dashboard/recruiter/analytics/page.js
'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import { applicationAPI, jobAPI } from '@/lib/api';
import ProgressBar from '@/components/ui/ProgressBar';

export default function RecruiterAnalytics() {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all jobs
        const jobsResponse = await jobAPI.getMyJobs();
        setJobs(jobsResponse.data.data);

        // Get all applications across jobs
        let allApplications = [];
        for (const job of jobsResponse.data.data) {
          const applicationsResponse = await applicationAPI.getJobApplications(job._id);
          allApplications = [...allApplications, ...applicationsResponse.data.data];
        }

        setApplications(allApplications);
        
        // Select the first application if available
        if (allApplications.length > 0) {
          setSelectedApplication(allApplications[0]);
        }
        
        setError(null);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load analytics data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
      <h1 className="text-2xl font-bold mb-6">Candidate Analytics</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Candidate Selection */}
        <div className="lg:col-span-1">
          <Card>
            <h2 className="text-lg font-medium text-white mb-4">Last Reviewed Resumes</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-dark-100">
                <thead className="bg-dark-300">
                  <tr>
                    <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Id
                    </th>
                    <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Resume List
                    </th>
                    <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      ATS Score
                    </th>
                    <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Breakdown
                    </th>
                    <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                      View Resume
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-dark-200 divide-y divide-dark-100">
                  {applications.slice(0, 10).map((application, index) => (
                    <tr 
                      key={application._id} 
                      className={`cursor-pointer hover:bg-dark-300 ${selectedApplication?._id === application._id ? 'bg-dark-300' : ''}`}
                      onClick={() => setSelectedApplication(application)}
                    >
                      <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-300">
                        {index + 1}
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-300">
                        {application.profile.resume?.originalName || 'Resume_' + (index + 1) + '.pdf'}
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap text-sm text-primary-500 font-medium">
                        {application.aiScore || '72'}%
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap text-sm text-primary-500">
                        <button 
                          className="text-xs text-primary-500 hover:text-primary-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedApplication(application);
                          }}
                        >
                          view details
                        </button>
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap text-center text-blue-500 text-sm">
                        <a 
                          href="#" 
                          className="text-blue-500 hover:text-blue-400"
                          onClick={(e) => e.stopPropagation()}
                        >
                          N/A
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
        
        {/* Analytics Content */}
        <div className="lg:col-span-2">
          {selectedApplication ? (
            <div className="space-y-6">
              {/* Candidate Evaluation */}
              <Card>
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="w-full md:w-1/2">
                    <h2 className="text-lg font-medium text-white mb-1">Candidate Evaluation</h2>
                    <p className="text-xs text-gray-400 mb-4">Overall evaluation of the candidate</p>
                    
                    {/* Diamond shape chart */}
                    <div className="relative h-72 w-full flex justify-center">
                      <svg viewBox="0 0 250 250" className="w-full max-w-xs">
                        {/* Grid lines */}
                        <circle cx="125" cy="125" r="100" fill="none" stroke="#333" strokeWidth="1" />
                        <circle cx="125" cy="125" r="75" fill="none" stroke="#333" strokeWidth="1" />
                        <circle cx="125" cy="125" r="50" fill="none" stroke="#333" strokeWidth="1" />
                        <circle cx="125" cy="125" r="25" fill="none" stroke="#333" strokeWidth="1" />
                        
                        {/* Axes */}
                        <line x1="125" y1="25" x2="125" y2="225" stroke="#333" strokeWidth="1" />
                        <line x1="25" y1="125" x2="225" y2="125" stroke="#333" strokeWidth="1" />
                        
                        {/* Diamond shape based on scores */}
                        <polygon 
                          points={`
                            125,${125 - 70} 
                            ${125 + 90},125 
                            125,${125 + 60} 
                            ${125 - 60},125
                          `} 
                          fill="#D97706" 
                          fillOpacity="0.7" 
                        />
                        
                        {/* Labels */}
                        <text x="125" y="15" textAnchor="middle" fill="#9CA3AF" fontSize="12">Keyword Matches</text>
                        <text x="235" y="125" textAnchor="end" fill="#9CA3AF" fontSize="12">Experience</text>
                        <text x="125" y="235" textAnchor="middle" fill="#9CA3AF" fontSize="12">Project Relevance</text>
                        <text x="15" y="125" textAnchor="start" fill="#9CA3AF" fontSize="12">Achievements</text>
                      </svg>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-1/2">
                    <h2 className="text-lg font-medium text-white mb-1">Overall Score</h2>
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <span></span>
                        <span className="text-lg text-primary-500 font-medium">{selectedApplication.aiScore || '72'} %</span>
                      </div>
                      <div className="bg-dark-700 rounded-full h-8 overflow-hidden">
                        {/* Progress bar */}
                        <div 
                          className="h-8 bg-primary-600 rounded-full flex items-center"
                          style={{ width: `${selectedApplication.aiScore || 72}%` }}
                        >
                          {Array.from({ length: Math.floor((selectedApplication.aiScore || 72) / 4) }).map((_, i) => (
                            <div key={i} className="h-8 w-4 bg-primary-600"></div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <h2 className="text-lg font-medium text-white mb-2">Relevant Keyword Matches</h2>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {selectedApplication.job?.skills?.map(skill => (
                        <span key={skill} className="text-xs px-2 py-1 rounded bg-dark-300 text-primary-500 border border-dark-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                    
                    <h2 className="text-lg font-medium text-white mb-1">Strength Chart</h2>
                    <p className="text-xs text-gray-400 mb-4">Breakdown of the candidate's strengths</p>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-300">Keyword Matches</span>
                          <span className="text-sm font-medium text-primary-500">70</span>
                        </div>
                        <ProgressBar percentage={70} className="bg-primary-600" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-300">Experience</span>
                          <span className="text-sm font-medium text-primary-500">80</span>
                        </div>
                        <ProgressBar percentage={80} className="bg-red-500" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-300">Project Relevance</span>
                          <span className="text-sm font-medium text-primary-500">60</span>
                        </div>
                        <ProgressBar percentage={60} className="bg-orange-600" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-300">Achievements</span>
                          <span className="text-sm font-medium text-primary-500">20</span>
                        </div>
                        <ProgressBar percentage={20} className="bg-yellow-600" />
                      </div>
                    </div>
                    
                    <div className="mt-4 text-green-500 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm">High Match: Candidate is highly suitable for this role.</span>
                    </div>
                  </div>
                </div>
              </Card>
              
              {/* Summary Section */}
              <Card>
                <h2 className="text-lg font-medium text-white mb-4">Summary</h2>
                <p className="text-gray-300">
                  {selectedApplication.profile.bio || `The candidate, ${selectedApplication.applicant.name}, is a frontend developer with around 2.5 years of experience in building small-scale web applications using ReactJS, having skills in JavaScript, HTML5, CSS3, Node.js, Express.js, Git, GitHub, and Bootstrap, with a basic understanding of Redux and experience in creating responsive designs.`}
                </p>
                
                <h2 className="text-lg font-medium text-white mt-6 mb-4">Missing Keywords</h2>
                <div className="flex flex-wrap gap-2">
                  {['internships', 'certificates', 'project management', 'agile methodologies', 'backend development', 'testing frameworks', 'UI/UX design'].map(keyword => (
                    <span key={keyword} className="bg-red-900/30 text-red-400 text-xs px-2 py-1 rounded border border-red-800">
                      {keyword}
                    </span>
                  ))}
                </div>
              </Card>
            </div>
          ) : (
            <Card>
              <div className="text-center py-20">
                <p className="text-gray-400">Select a candidate to view analytics</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}