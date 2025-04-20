// src/app/dashboard/recruiter/jobs/[id]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  ClockIcon, 
  MapPinIcon, 
  BriefcaseIcon, 
  CurrencyDollarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import ApplicationList from '@/components/applications/ApplicationList';
import { jobAPI, applicationAPI, aiAPI } from '@/lib/api';

export default function JobDetail() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingApplications, setIsLoadingApplications] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch job details
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await jobAPI.getJob(id);
        setJob(response.data.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch job:', err);
        setError('Failed to load job details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [id]);
  
  // Fetch applications for this job
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await applicationAPI.getJobApplications(id);
        setApplications(response.data.data);
      } catch (err) {
        console.error('Failed to fetch applications:', err);
      } finally {
        setIsLoadingApplications(false);
      }
    };

    if (!isLoading && job) {
      fetchApplications();
    }
  }, [id, isLoading, job]);
  
  const handleStatusChange = async (newStatus) => {
    try {
      const response = await jobAPI.updateJob(id, { status: newStatus });
      setJob(response.data.data);
    } catch (err) {
      console.error('Failed to update job status:', err);
      alert('Failed to update job status. Please try again.');
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      try {
        await jobAPI.deleteJob(id);
        router.push('/dashboard/recruiter/jobs');
      } catch (err) {
        console.error('Failed to delete job:', err);
        alert('Failed to delete job. Please try again.');
      }
    }
  };
  
  const handleShortlist = async () => {
    setIsProcessing(true);
    try {
      await aiAPI.triggerShortlisting(id);
      // Refresh applications after shortlisting
      const response = await applicationAPI.getJobApplications(id);
      setApplications(response.data.data);
      alert('Applications have been analyzed and shortlisted successfully!');
    } catch (err) {
      console.error('Shortlisting failed:', err);
      alert('Failed to shortlist applications. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (error || !job) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error || 'Job not found'}</p>
        <Button onClick={() => router.push('/dashboard/recruiter/jobs')}>Back to Jobs</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{job.title}</h1>
        
        <div className="flex space-x-2">
          <Button 
            variant="secondary"
            onClick={() => router.push(`/dashboard/recruiter/jobs/${id}/edit`)}
          >
            Edit Job
          </Button>
          <Button 
            variant="danger"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </div>
      
      {/* Job Details Card */}
      <Card className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-medium text-white">{job.company.name}</h2>
            <p className="text-gray-400">{job.company.location}</p>
          </div>
          
          <div className="flex items-center">
            <span className={`
              px-2.5 py-1 text-xs font-medium rounded-md
              ${job.status === 'open' ? 'bg-green-100 text-green-800' : 
                job.status === 'closed' ? 'bg-red-100 text-red-800' : 
                'bg-gray-100 text-gray-800'}
            `}>
              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center">
            <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-gray-300">{job.location}</span>
            {job.remote && (
              <span className="ml-2 text-xs bg-primary-100 text-primary-800 px-2 py-0.5 rounded">Remote</span>
            )}
          </div>
          
          <div className="flex items-center">
            <BriefcaseIcon className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-gray-300">
              {job.experienceLevel.charAt(0).toUpperCase() + job.experienceLevel.slice(1)} Level
            </span>
          </div>
          
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-gray-300">
              {job.salary && job.salary.min && job.salary.max 
                ? `${job.salary.currency} ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}`
                : 'Salary not specified'}
            </span>
          </div>
          
          <div className="flex items-center">
            <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-gray-300">
              {job.employmentType.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </span>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-md font-medium text-white mb-2">Description</h3>
          <p className="text-gray-300 whitespace-pre-line">{job.description}</p>
        </div>
        
        <div className="mb-6">
          <h3 className="text-md font-medium text-white mb-2">Requirements</h3>
          <p className="text-gray-300 whitespace-pre-line">{job.requirements}</p>
        </div>
        
        <div>
          <h3 className="text-md font-medium text-white mb-2">Skills</h3>
          <div className="flex flex-wrap">
            {job.skills.map((skill) => (
              <span key={skill} className="keyword-tag">
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        {job.status === 'open' ? (
          <Button 
            variant="secondary" 
            className="mt-4"
            onClick={() => handleStatusChange('closed')}
          >
            Close Job
          </Button>
        ) : (
          <Button 
            variant="primary" 
            className="mt-4"
            onClick={() => handleStatusChange('open')}
          >
            Reopen Job
          </Button>
        )}
      </Card>
      
      {/* Applications Card */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-medium text-white">Applications</h2>
            <p className="text-sm text-gray-400">
              {applications.length} {applications.length === 1 ? 'application' : 'applications'} received
            </p>
          </div>
          
          {applications.length > 0 && (
            <Button 
              variant="primary"
              onClick={handleShortlist}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'AI Shortlist Applications'}
            </Button>
          )}
        </div>
        
        {isLoadingApplications ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-8">
            <UserGroupIcon className="h-12 w-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">No applications yet</p>
          </div>
        ) : (
          <ApplicationList 
            applications={applications} 
            onStatusChange={(appId, newStatus) => {
              // Update application status and refresh list
              applicationAPI.updateApplicationStatus(appId, { status: newStatus })
                .then(() => {
                  // Update local state to reflect the change
                  setApplications(applications.map(app => 
                    app._id === appId ? { ...app, status: newStatus } : app
                  ));
                })
                .catch(err => {
                  console.error('Failed to update application status:', err);
                  alert('Failed to update application status.');
                });
            }}
            onAnalyze={(appId) => {
              // Trigger analysis for a single application
              aiAPI.analyzeApplication(appId)
                .then(() => {
                  // Refresh applications to get updated analysis
                  return applicationAPI.getJobApplications(id);
                })
                .then((response) => {
                  setApplications(response.data.data);
                  alert('Application analysis complete!');
                })
                .catch(err => {
                  console.error('Analysis failed:', err);
                  alert('Failed to analyze application.');
                });
            }}
          />
        )}
      </Card>
    </div>
  );
}