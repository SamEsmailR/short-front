// src/app/dashboard/applicant/jobs/[id]/page.js
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
  BuildingOfficeIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { jobAPI, applicationAPI, profileAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function JobDetail() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { id } = params;
  
  const [job, setJob] = useState(null);
  const [profile, setProfile] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [application, setApplication] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
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
  
  // Fetch user profile and check if already applied
  useEffect(() => {
    const fetchProfileAndApplicationStatus = async () => {
      try {
        // Fetch profile
        const profileResponse = await profileAPI.getMyProfile();
        setProfile(profileResponse.data.data);
        
        // Check if already applied
        const applicationsResponse = await applicationAPI.getMyApplications();
        const applications = applicationsResponse.data.data;
        
        const existingApplication = applications.find(app => app.job._id === id);
        if (existingApplication) {
          setHasApplied(true);
          setApplication(existingApplication);
        }
      } catch (err) {
        console.error('Failed to fetch profile or application status:', err);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    if (!isLoading && job) {
      fetchProfileAndApplicationStatus();
    }
  }, [id, isLoading, job]);
  
  const handleApply = async () => {
    // Check if profile is complete
    if (!profile.profileComplete) {
      alert('Please complete your profile before applying.');
      router.push('/dashboard/applicant/profile');
      return;
    }
    
    setIsApplying(true);
    
    try {
      const response = await applicationAPI.applyForJob(id, { coverLetter });
      setHasApplied(true);
      setApplication(response.data.data);
      alert('Application submitted successfully!');
    } catch (err) {
      console.error('Failed to apply:', err);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsApplying(false);
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
        <Button onClick={() => router.push('/dashboard/applicant/jobs')}>Back to Jobs</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{job.title}</h1>
        
        {!isLoadingProfile && (
          hasApplied ? (
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-md">
              Applied
            </div>
          ) : (
            <Button 
              variant="primary"
              onClick={() => document.getElementById('apply-section').scrollIntoView({ behavior: 'smooth' })}
            >
              Apply Now
            </Button>
          )
        )}
      </div>
      
      {/* Job Details Card */}
      <Card className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-medium text-white">{job.company.name}</h2>
            <p className="text-gray-400">{job.company.location}</p>
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
        
        {job.company.website && (
          <div className="flex items-center mb-6">
            <GlobeAltIcon className="h-5 w-5 text-gray-400 mr-2" />
            <a 
              href={job.company.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-500 hover:text-primary-400"
            >
              {job.company.website}
            </a>
          </div>
        )}
        
        <div className="mb-6">
          <h3 className="text-md font-medium text-white mb-2">Company Description</h3>
          <p className="text-gray-300">{job.company.description || 'No company description available.'}</p>
        </div>
        
        <div className="mb-6">
          <h3 className="text-md font-medium text-white mb-2">Job Description</h3>
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
      </Card>
      
      {/* Application Section */}
      {!hasApplied ? (
        <Card id="apply-section">
          <h2 className="text-lg font-medium text-white mb-4">Apply for this Position</h2>
          
          {isLoadingProfile ? (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
  </div>
) : !profile ? (
  // First check if profile exists
  <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4" role="alert">
    <p className="font-medium">Profile not found!</p>
    <p className="text-sm">You need to create a profile before applying for jobs.</p>
    <div className="mt-3">
      <Button 
        variant="primary" 
        onClick={() => router.push('/dashboard/applicant/profile')}
      >
        Create Profile
      </Button>
    </div>
  </div>
) : !profile.profileComplete ? (
  // Then check if profile is complete
  <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4" role="alert">
    <p className="font-medium">Your profile is incomplete!</p>
    <p className="text-sm">To apply for this job, you need to complete your profile and upload your resume.</p>
    <div className="mt-3">
      <Button 
        variant="primary" 
        onClick={() => router.push('/dashboard/applicant/profile')}
      >
        Complete Profile
      </Button>
    </div>
  </div>
) : (
<>
<p className="text-gray-400 mb-4">
  You're applying as <span className="text-white font-medium">{user.name}</span> with the profile title <span className="text-white font-medium">{profile.title || 'No title'}</span>.
</p>

<div className="mb-4">
  <label className="form-label">Cover Letter</label>
  <textarea
    className="input w-full"
    rows={6}
    placeholder="Tell the employer why you're a good fit for this position..."
    value={coverLetter}
    onChange={(e) => setCoverLetter(e.target.value)}
  />
</div>

<Button 
  variant="primary" 
  className="w-full"
  onClick={handleApply}
  disabled={isApplying}
>
  {isApplying ? 'Submitting...' : 'Submit Application'}
</Button>
</>
)}
</Card>
) : (
<Card id="apply-section">
<h2 className="text-lg font-medium text-white mb-4">Application Status</h2>

<div className="bg-dark-300 rounded-lg p-4">
<div className="flex items-center justify-between mb-4">
<div>
  <p className="text-sm text-gray-400">Applied on {new Date(application.createdAt).toLocaleDateString()}</p>
  <div className="mt-1">
    {application.status === 'pending' && (
      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Pending</span>
    )}
    {application.status === 'reviewed' && (
      <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">Reviewed</span>
    )}
    {application.status === 'shortlisted' && (
      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Shortlisted</span>
    )}
    {application.status === 'rejected' && (
      <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">Rejected</span>
    )}
    {application.status === 'hired' && (
      <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">Hired</span>
    )}
  </div>
</div>

{application.aiScore !== undefined && (
  <div className="text-center">
    <p className="text-sm text-gray-400">Match Score</p>
    <div className="text-xl font-bold text-primary-500">{application.aiScore}%</div>
  </div>
)}
</div>

{application.coverLetter && (
<div className="mt-3">
  <p className="text-sm font-medium text-gray-200 mb-1">Your Cover Letter</p>
  <p className="text-sm text-gray-400 whitespace-pre-line">{application.coverLetter}</p>
</div>
)}

{application.aiInsights && (
<div className="mt-4">
  <p className="text-sm font-medium text-gray-200 mb-2">AI Insights</p>
  
  <div className="bg-dark-200 rounded-md p-3">
    {application.aiInsights.strengths && application.aiInsights.strengths.length > 0 && (
      <div className="mb-3">
        <p className="text-xs font-medium text-green-500 mb-1">Strengths</p>
        <ul className="text-xs text-gray-300 list-disc list-inside">
          {application.aiInsights.strengths.map((strength, index) => (
            <li key={index}>{strength}</li>
          ))}
        </ul>
      </div>
    )}
    
    {application.aiInsights.weaknesses && application.aiInsights.weaknesses.length > 0 && (
      <div className="mb-3">
        <p className="text-xs font-medium text-red-500 mb-1">Areas to Improve</p>
        <ul className="text-xs text-gray-300 list-disc list-inside">
          {application.aiInsights.weaknesses.map((weakness, index) => (
            <li key={index}>{weakness}</li>
          ))}
        </ul>
      </div>
    )}
    
    {application.aiInsights.recommendations && (
      <div>
        <p className="text-xs font-medium text-primary-500 mb-1">Recommendations</p>
        <p className="text-xs text-gray-300">{application.aiInsights.recommendations}</p>
      </div>
    )}
  </div>
</div>
)}
</div>

<Button 
variant="secondary" 
className="mt-4"
onClick={() => router.push('/dashboard/applicant/applications')}
>
View All Applications
</Button>
</Card>
)}
</div>
);
}