// src/app/dashboard/recruiter/applications/[id]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import { applicationAPI, aiAPI } from '@/lib/api';
import { 
  ChartBarIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  DocumentTextIcon
} from '@heroicons/react/24/outline';

export default function ApplicationDetail() {
  const router = useRouter();
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await applicationAPI.getApplication(id);
        setApplication(response.data.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch application:', err);
        setError('Failed to load application details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchApplication();
    }
  }, [id]);
  
  const handleStatusChange = async (newStatus) => {
    try {
      const response = await applicationAPI.updateApplicationStatus(id, { 
        status: newStatus 
      });
      
      setApplication({
        ...application,
        status: newStatus
      });
      
      alert(`Application marked as ${newStatus}`);
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update application status');
    }
  };
  
  const handleAnalyze = async () => {
    setIsProcessing(true);
    
    try {
      await aiAPI.analyzeApplication(id);
      
      // Refresh application data to get updated analysis
      const response = await applicationAPI.getApplication(id);
      setApplication(response.data.data);
      
      alert('Analysis completed successfully!');
    } catch (err) {
      console.error('Analysis failed:', err);
      alert('Failed to analyze application');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Pending</span>;
      case 'reviewed':
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">Reviewed</span>;
      case 'shortlisted':
        return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Shortlisted</span>;
        // src/app/dashboard/recruiter/applications/[id]/page.js (continued)
      case 'rejected':
        return <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">Rejected</span>;
      case 'hired':
        return <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">Hired</span>;
      default:
        return null;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (error || !application) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error || 'Application not found'}</p>
        <Button 
          variant="primary"
          onClick={() => router.push('/dashboard/recruiter/applications')}
        >
          Back to Applications
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Application Details</h1>
        <div className="flex space-x-2">
          <Button 
            variant="secondary"
            onClick={() => router.push('/dashboard/recruiter/applications')}
          >
            Back to List
          </Button>
          
          {!application.aiScore && (
            <Button 
              variant="primary"
              onClick={handleAnalyze}
              disabled={isProcessing}
            >
              {isProcessing ? 'Analyzing...' : 'Analyze Application'}
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Applicant info */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <div className="flex items-center mb-4">
              <div className="h-16 w-16 rounded-full bg-primary-600 flex items-center justify-center mr-4">
                <span className="text-white text-2xl font-medium">
                  {application.applicant.name.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-lg font-medium text-white">{application.applicant.name}</h2>
                <p className="text-gray-400">{application.profile.title || 'No title specified'}</p>
                <div className="mt-1">
                  {getStatusBadge(application.status)}
                </div>
              </div>
            </div>
            
            <p className="text-gray-300 mb-4">{application.profile.bio || 'No bio available'}</p>
            
            <div className="flex items-center mt-2">
              <Button 
                variant="secondary" 
                className="mr-2"
                onClick={() => handleStatusChange('shortlisted')}
              >
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                Shortlist
              </Button>
              <Button 
                variant="danger"
                onClick={() => handleStatusChange('rejected')}
              >
                <XCircleIcon className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </div>
          </Card>
          
          {/* Contact Info */}
          <Card>
            <h2 className="text-lg font-medium text-white mb-4">Contact Information</h2>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-white">{application.applicant.email}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-400">Location</p>
                <p className="text-white">{application.profile.location || 'Not specified'}</p>
              </div>
              
              {application.profile.contact?.phone && (
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <p className="text-white">{application.profile.contact.phone}</p>
                </div>
              )}
              
              {application.profile.contact?.linkedIn && (
                <div>
                  <p className="text-sm text-gray-400">LinkedIn</p>
                  <a 
                    href={application.profile.contact.linkedIn} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary-500 hover:text-primary-400"
                  >
                    {application.profile.contact.linkedIn}
                  </a>
                </div>
              )}
              
              {application.profile.contact?.github && (
                <div>
                  <p className="text-sm text-gray-400">GitHub</p>
                  <a 
                    href={application.profile.contact.github} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary-500 hover:text-primary-400"
                  >
                    {application.profile.contact.github}
                  </a>
                </div>
              )}
            </div>
          </Card>
          
          {/* Resume */}
          {application.profile.resume && (
            <Card>
              <h2 className="text-lg font-medium text-white mb-4">Resume</h2>
              
              <div className="bg-dark-300 rounded-lg p-4 flex items-center">
                <DocumentTextIcon className="h-10 w-10 text-primary-500 mr-3" />
                <div>
                  <h3 className="text-white font-medium">{application.profile.resume.originalName || 'Resume.pdf'}</h3>
                  <p className="text-sm text-gray-400">
                    Uploaded on {new Date(application.profile.resume.uploadDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
        
        {/* Middle column - Profile details */}
        <div className="md:col-span-1 space-y-6">
          {/* Skills */}
          <Card>
            <h2 className="text-lg font-medium text-white mb-4">Skills</h2>
            
            <div className="flex flex-wrap">
              {application.profile.skills && application.profile.skills.length > 0 ? (
                application.profile.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="mr-2 mb-2 bg-dark-300 text-primary-500 text-xs px-2 py-1 rounded"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-400">No skills listed</p>
              )}
            </div>
          </Card>
          
          {/* Experience */}
          <Card>
            <h2 className="text-lg font-medium text-white mb-4">Experience</h2>
            
            {application.profile.experience && application.profile.experience.length > 0 ? (
              <div className="space-y-4">
                {application.profile.experience.map((exp, index) => (
                  <div key={index} className={index < application.profile.experience.length - 1 ? "pb-4 border-b border-dark-100" : ""}>
                    <h3 className="text-white font-medium">{exp.title}</h3>
                    <p className="text-gray-400">{exp.company} • {exp.location || 'Unknown location'}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(exp.from).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - 
                      {exp.current 
                        ? ' Present'
                        : exp.to ? ` ${new Date(exp.to).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}` : ' Unknown'
                      }
                    </p>
                    {exp.description && <p className="text-gray-300 mt-2">{exp.description}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No experience listed</p>
            )}
          </Card>
          
          {/* Education */}
          <Card>
            <h2 className="text-lg font-medium text-white mb-4">Education</h2>
            
            {application.profile.education && application.profile.education.length > 0 ? (
              <div className="space-y-4">
                {application.profile.education.map((edu, index) => (
                  <div key={index} className={index < application.profile.education.length - 1 ? "pb-4 border-b border-dark-100" : ""}>
                    <h3 className="text-white font-medium">
                      {edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}
                    </h3>
                    <p className="text-gray-400">{edu.institution}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(edu.from).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - 
                      {edu.current 
                        ? ' Present'
                        : edu.to ? ` ${new Date(edu.to).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}` : ' Unknown'
                      }
                    </p>
                    {edu.description && <p className="text-gray-300 mt-2">{edu.description}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No education listed</p>
            )}
          </Card>
        </div>
        
        {/* Right column - AI Analysis and Job details */}
        <div className="md:col-span-1 space-y-6">
          {/* AI Analysis */}
          <Card>
            <h2 className="text-lg font-medium text-white mb-4">AI Analysis</h2>
            
            {application.aiScore ? (
              <>
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-400">Match Score</span>
                    <span className="text-sm font-medium text-primary-500">{application.aiScore}%</span>
                  </div>
                  <ProgressBar percentage={application.aiScore} />
                </div>
                
                {application.aiInsights && (
                  <div className="space-y-4">
                    {application.aiInsights.strengths && application.aiInsights.strengths.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-green-500 mb-2">Strengths</h3>
                        <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                          {application.aiInsights.strengths.map((strength, index) => (
                            <li key={index}>{strength}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {application.aiInsights.weaknesses && application.aiInsights.weaknesses.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-red-500 mb-2">Weaknesses</h3>
                        <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                          {application.aiInsights.weaknesses.map((weakness, index) => (
                            <li key={index}>{weakness}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {application.aiInsights.recommendations && (
                      <div>
                        <h3 className="text-sm font-medium text-primary-500 mb-2">Recommendations</h3>
                        <p className="text-gray-300 text-sm">{application.aiInsights.recommendations}</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-6">
                <ChartBarIcon className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400 mb-4">No AI analysis available yet</p>
                <Button 
                  variant="primary"
                  onClick={handleAnalyze}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Analyzing...' : 'Run Analysis'}
                </Button>
              </div>
            )}
          </Card>
          
          {/* Job Details */}
          <Card>
            <h2 className="text-lg font-medium text-white mb-4">Job Details</h2>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400">Position</p>
                <p className="text-white font-medium">{application.job.title}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-400">Company</p>
                <p className="text-white">{application.job.company.name}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-400">Location</p>
                <p className="text-white">
                  {application.job.location}
                  {application.job.remote && <span className="ml-2 text-xs bg-primary-900 text-primary-400 px-2 py-0.5 rounded">Remote</span>}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-400">Employment Type</p>
                <p className="text-white">
                  {application.job.employmentType.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-400">Experience Level</p>
                <p className="text-white">
                  {application.job.experienceLevel.charAt(0).toUpperCase() + application.job.experienceLevel.slice(1)} Level
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <Button 
                variant="secondary"
                onClick={() => router.push(`/dashboard/recruiter/jobs/${application.job._id}`)}
              >
                View Job Details
              </Button>
            </div>
          </Card>
          
          {/* Cover Letter */}
          {application.coverLetter && (
            <Card>
              <h2 className="text-lg font-medium text-white mb-4">Cover Letter</h2>
              <p className="text-gray-300 whitespace-pre-line">{application.coverLetter}</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}