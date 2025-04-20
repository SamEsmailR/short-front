// src/components/applications/ApplicationList.jsx
import Link from 'next/link';
import { ChartBarIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import ProgressBar from '@/components/ui/ProgressBar';

const ApplicationList = ({ applications, onStatusChange, onAnalyze }) => {
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

  const sortedApplications = [...applications].sort((a, b) => {
    // Sort by AI score (if available) in descending order
    if (a.aiScore !== undefined && b.aiScore !== undefined) {
      return b.aiScore - a.aiScore;
    } 
    // If no AI score, sort by status priority
    const statusPriority = {
      'shortlisted': 0,
      'reviewed': 1,
      'pending': 2,
      'rejected': 3,
    };
    return statusPriority[a.status] - statusPriority[b.status];
  });

  return (
    <div className="space-y-4">
      {sortedApplications.map((application) => (
        <div 
          key={application._id} 
          className="bg-dark-300 rounded-xl p-4 border border-dark-100"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-white font-medium">
                {application.applicant.name}
              </h3>
              <p className="text-sm text-gray-400">
                {application.profile.title || 'No title specified'}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              {getStatusBadge(application.status)}
              {application.aiScore !== undefined && (
                <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {application.aiScore}% Match
                </span>
              )}
            </div>
          </div>
          
          {/* Skills section */}
          {application.profile.skills && application.profile.skills.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-gray-400 mb-1">Skills</p>
              <div className="flex flex-wrap">
                {application.profile.skills.slice(0, 5).map((skill, index) => (
                  <span key={index} className="keyword-tag text-xs">
                    {skill}
                  </span>
                ))}
                {application.profile.skills.length > 5 && (
                  <span className="keyword-tag text-xs">
                    +{application.profile.skills.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}
          
          {/* AI analysis section */}
          {application.aiInsights && (
            <div className="mt-3">
              <p className="text-xs text-gray-400 mb-1">AI Analysis</p>
              <div className="bg-dark-200 rounded-md p-3">
                {application.aiScore !== undefined && (
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Match Score</span>
                      <span className="text-primary-500">{application.aiScore}%</span>
                    </div>
                    <ProgressBar percentage={application.aiScore} />
                  </div>
                )}
                
                {application.aiInsights.strengths && application.aiInsights.strengths.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs font-medium text-green-500 mb-1">Strengths</p>
                    <ul className="text-xs text-gray-300 list-disc list-inside">
                      {application.aiInsights.strengths.slice(0, 2).map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {application.aiInsights.weaknesses && application.aiInsights.weaknesses.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-red-500 mb-1">Weaknesses</p>
                    <ul className="text-xs text-gray-300 list-disc list-inside">
                      {application.aiInsights.weaknesses.slice(0, 2).map((weakness, index) => (
                        <li key={index}>{weakness}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Action buttons */}
          <div className="mt-4 flex justify-between">
            <div>
              <Link 
                href={`/dashboard/recruiter/applications/${application._id}`}
                className="text-primary-500 hover:text-primary-400 text-sm font-medium"
              >
                View Details
              </Link>
            </div>
            
            <div className="flex space-x-2">
              {!application.aiScore && (
                <button
                  className="flex items-center text-blue-500 hover:text-blue-400 text-sm"
                  onClick={() => onAnalyze(application._id)}
                >
                  <ChartBarIcon className="h-4 w-4 mr-1" />
                  Analyze
                </button>
              )}
              
              {application.status !== 'shortlisted' && (
                <button
                  className="flex items-center text-green-500 hover:text-green-400 text-sm"
                  onClick={() => onStatusChange(application._id, 'shortlisted')}
                >
                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                  Shortlist
                </button>
              )}
              
              {application.status !== 'rejected' && (
                <button
                  className="flex items-center text-red-500 hover:text-red-400 text-sm"
                  onClick={() => onStatusChange(application._id, 'rejected')}
                >
                  <XCircleIcon className="h-4 w-4 mr-1" />
                  Reject
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApplicationList;