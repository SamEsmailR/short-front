// src/app/dashboard/applicant/jobs/page.js
'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import JobCard from '@/components/jobs/JobCard';
import { jobAPI } from '@/lib/api';

export default function JobSearch() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    experienceLevel: '',
    employmentType: '',
    remote: false,
  });
  
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await jobAPI.getJobs({ status: 'open' });
        setJobs(response.data.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
        setError('Failed to load jobs. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  
  const filteredJobs = jobs.filter(job => {
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      if (
        !job.title.toLowerCase().includes(searchLower) &&
        !job.company.name.toLowerCase().includes(searchLower) &&
        !job.location.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }
    
    // Filter by experience level
    if (filters.experienceLevel && job.experienceLevel !== filters.experienceLevel) {
      return false;
    }
    
    // Filter by employment type
    if (filters.employmentType && job.employmentType !== filters.employmentType) {
      return false;
    }
    
    // Filter by remote
    if (filters.remote && !job.remote) {
      return false;
    }
    
    return true;
  });
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Find Jobs</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <h2 className="text-lg font-medium text-white mb-4">Filters</h2>
            
            <div className="space-y-4">
              <div>
                <label className="form-label mb-1">Experience Level</label>
                <select
                  name="experienceLevel"
                  className="input w-full"
                  value={filters.experienceLevel}
                  onChange={handleFilterChange}
                >
                  <option value="">All Levels</option>
                  <option value="entry">Entry Level</option>
                  <option value="junior">Junior</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior</option>
                  <option value="lead">Lead</option>
                  <option value="executive">Executive</option>
                </select>
              </div>
              
              <div>
                <label className="form-label mb-1">Employment Type</label>
                <select
                  name="employmentType"
                  className="input w-full"
                  value={filters.employmentType}
                  onChange={handleFilterChange}
                >
                  <option value="">All Types</option>
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                  <option value="temporary">Temporary</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  id="remote"
                  name="remote"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-600 rounded"
                  checked={filters.remote}
                  onChange={handleFilterChange}
                />
                <label htmlFor="remote" className="ml-2 block text-sm text-gray-300">
                  Remote jobs only
                </label>
              </div>
              
              <button
                className="text-primary-500 hover:text-primary-400 text-sm font-medium"
                onClick={() => {
                  setFilters({
                    experienceLevel: '',
                    employmentType: '',
                    remote: false,
                  });
                  setSearchTerm('');
                }}
              >
                Clear all filters
              </button>
            </div>
          </Card>
        </div>
        
        {/* Job listings */}
        <div className="lg:col-span-3">
          <Card>
            <div className="mb-4">
              <Input
                placeholder="Search jobs by title, company, or location..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                  className="text-primary-500 hover:text-primary-400"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No jobs found matching your criteria.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <JobCard 
                    key={job._id} 
                    job={job} 
                    isRecruiter={false} 
                    link={`/dashboard/applicant/jobs/${job._id}`} 
                  />
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}