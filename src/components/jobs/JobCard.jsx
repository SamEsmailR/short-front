// src/components/jobs/JobCard.jsx
import Link from 'next/link';
import { 
  CalendarIcon, 
  MapPinIcon, 
  BriefcaseIcon,
  UserGroupIcon 
} from '@heroicons/react/24/outline';

const JobCard = ({ job, isRecruiter = false, link }) => {
  const { 
    id, 
    title, 
    company, 
    location, 
    employmentType, 
    experienceLevel, 
    createdAt, 
    applicationsCount, 
    status 
  } = job;
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const getStatusBadge = () => {
    switch (status) {
      case 'open':
        return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Open</span>;
      case 'closed':
        return <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">Closed</span>;
      case 'draft':
        return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">Draft</span>;
      default:
        return null;
    }
  };
  
  const getExperienceBadge = () => {
    const colors = {
      entry: 'bg-blue-100 text-blue-800',
      junior: 'bg-sky-100 text-sky-800',
      mid: 'bg-indigo-100 text-indigo-800',
      senior: 'bg-purple-100 text-purple-800',
      lead: 'bg-pink-100 text-pink-800',
      executive: 'bg-yellow-100 text-yellow-800',
    };
    
    const labels = {
      entry: 'Entry Level',
      junior: 'Junior',
      mid: 'Mid Level',
      senior: 'Senior',
      lead: 'Lead',
      executive: 'Executive',
    };
    
    const colorClass = colors[experienceLevel] || 'bg-gray-100 text-gray-800';
    const label = labels[experienceLevel] || experienceLevel;
    
    return (
      <span className={`${colorClass} text-xs font-medium px-2.5 py-0.5 rounded`}>
        {label}
      </span>
    );
  };
  
  const getEmploymentTypeBadge = () => {
    const colors = {
      'full-time': 'bg-green-100 text-green-800',
      'part-time': 'bg-blue-100 text-blue-800',
      'contract': 'bg-yellow-100 text-yellow-800',
      'internship': 'bg-purple-100 text-purple-800',
      'temporary': 'bg-orange-100 text-orange-800',
    };
    
    const labels = {
      'full-time': 'Full Time',
      'part-time': 'Part Time',
      'contract': 'Contract',
      'internship': 'Internship',
      'temporary': 'Temporary',
    };
    
    const colorClass = colors[employmentType] || 'bg-gray-100 text-gray-800';
    const label = labels[employmentType] || employmentType;
    
    return (
      <span className={`${colorClass} text-xs font-medium px-2.5 py-0.5 rounded ml-2`}>
        {label}
      </span>
    );
  };
  
  return (
    <Link href={link || `/jobs/${id}`}>
      <div className="bg-dark-300 rounded-xl p-4 border border-dark-100 hover:border-primary-500 transition-all">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-white">{title}</h3>
            <p className="text-sm text-gray-400">{company.name}</p>
          </div>
          
          <div className="flex flex-col items-end">
            {getStatusBadge()}
            
            {isRecruiter && applicationsCount !== undefined && (
              <div className="flex items-center mt-2 text-gray-400 text-sm">
                <UserGroupIcon className="h-4 w-4 mr-1" />
                {applicationsCount} applications
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap items-center text-sm text-gray-400">
          <div className="flex items-center mr-4">
            <MapPinIcon className="h-4 w-4 mr-1" />
            {location}
          </div>
          
          <div className="flex items-center mr-4">
            <BriefcaseIcon className="h-4 w-4 mr-1" />
            {getExperienceBadge()}
            {getEmploymentTypeBadge()}
          </div>
          
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1" />
            Posted on {formatDate(createdAt)}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;