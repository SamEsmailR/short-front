// src/app/dashboard/recruiter/jobs/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import JobCard from '@/components/jobs/JobCard';
import { jobAPI } from '@/lib/api';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await jobAPI.getMyJobs();
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
  
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredJobs = jobs.filter(job => {
    // Filter by status if not 'all'
    if (filter !== 'all' && job.status !== filter) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        job.title.toLowerCase().includes(searchLower) ||
        job.company.name.toLowerCase().includes(searchLower) ||
        job.location.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Job Listings</h1>
        <Link href="/dashboard/recruiter/jobs/create">
          <Button variant="primary">
            + Create New Job
          </Button>
        </Link>
      </div>
      
      <Card>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-medium text-white">All Jobs</h2>
            <p className="text-sm text-gray-400">Manage your job listings</p>
          </div>
          
          <div className="flex space-x-2">
            <select 
              className="bg-dark-300 border border-dark-100 text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 p-2.5"
              value={filter}
              onChange={handleFilterChange}
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="draft">Draft</option>
            </select>
            
            <input 
              type="text" 
              placeholder="Search jobs..." 
              className="bg-dark-300 border border-dark-100 text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 p-2.5" 
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No jobs found.</p>
            {searchTerm || filter !== 'all' ? (
              <Button 
                variant="secondary"
                onClick={() => {
                  setSearchTerm('');
                  setFilter('all');
                }}
              >
                Clear Filters
              </Button>
            ) : (
              <Link href="/dashboard/recruiter/jobs/create">
                <Button variant="primary">Create Your First Job</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <JobCard 
                key={job._id} 
                job={job} 
                isRecruiter={true} 
                link={`/dashboard/recruiter/jobs/${job._id}`} 
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}