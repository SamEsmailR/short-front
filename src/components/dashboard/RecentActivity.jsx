// src/components/dashboard/RecentActivity.jsx
import { 
    DocumentTextIcon, 
    CheckCircleIcon, 
    BriefcaseIcon, 
    XCircleIcon 
  } from '@heroicons/react/24/outline';
  
  const RecentActivity = ({ activities }) => {
    const getIcon = (type) => {
      switch (type) {
        case 'application':
          return <DocumentTextIcon className="h-5 w-5 text-blue-500" />;
        case 'shortlist':
          return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
        case 'job':
          return <BriefcaseIcon className="h-5 w-5 text-primary-500" />;
        case 'rejection':
          return <XCircleIcon className="h-5 w-5 text-red-500" />;
        default:
          return <DocumentTextIcon className="h-5 w-5 text-gray-500" />;
      }
    };
  
    return (
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start">
            <div className="bg-dark-300 p-2 rounded-lg mr-3">
              {getIcon(activity.type)}
            </div>
            <div className="flex-1">
              <p className="text-sm text-white">{activity.description}</p>
              <p className="text-xs text-gray-400">{activity.date}</p>
            </div>
            {activity.score && (
              <div className="bg-dark-300 py-1 px-2 rounded-md">
                <span className="text-sm font-medium text-primary-500">{activity.score}%</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  export default RecentActivity;