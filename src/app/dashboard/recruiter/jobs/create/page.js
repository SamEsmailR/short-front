// src/app/dashboard/recruiter/jobs/create/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { jobAPI } from '@/lib/api';

export default function CreateJob() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: '',
    company: {
      name: '',
      website: '',
      location: '',
      description: '',
    },
    description: '',
    requirements: '',
    skills: [],
    experienceLevel: 'mid',
    employmentType: 'full-time',
    salary: {
      min: '',
      max: '',
      currency: 'USD',
    },
    location: '',
    remote: false,
  });
  
  const [currentSkill, setCurrentSkill] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      // Handle nested objects (e.g., company.name)
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  
  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' && currentSkill.trim()) {
      e.preventDefault();
      addSkill();
    }
  };
  
  const addSkill = () => {
    if (!currentSkill.trim()) return;
    
    if (!formData.skills.includes(currentSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, currentSkill.trim()],
      });
    }
    
    setCurrentSkill('');
  };
  
  const removeSkill = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await jobAPI.createJob(formData);
      router.push(`/dashboard/recruiter/jobs/${response.data.data._id}`);
    } catch (error) {
      console.error('Job creation error:', error);
      setErrors({ general: 'Failed to create job. Please try again.' });
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create New Job</h1>
      
      <Card>
        {errors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{errors.general}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Basic information */}
          <div className="mb-6">
            <h2 className="text-lg font-medium text-white mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Job Title"
                name="title"
                placeholder="e.g. Senior React Developer"
                value={formData.title}
                onChange={handleChange}
                error={errors.title}
                required
              />
              
              <Input
                label="Company Name"
                name="company.name"
                placeholder="e.g. TechInnovate Inc."
                value={formData.company.name}
                onChange={handleChange}
                error={errors.companyName}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Input
                label="Company Website"
                name="company.website"
                placeholder="e.g. https://company.com"
                value={formData.company.website}
                onChange={handleChange}
                error={errors.companyWebsite}
              />
              
              <Input
                label="Company Location"
                name="company.location"
                placeholder="e.g. San Francisco, CA"
                value={formData.company.location}
                onChange={handleChange}
                error={errors.companyLocation}
              />
            </div>
            
            <div className="mt-4">
              <label htmlFor="company.description" className="form-label">
                Company Description
              </label>
              <textarea
                id="company.description"
                name="company.description"
                rows={3}
                className="input"
                placeholder="Brief description of the company"
                value={formData.company.description}
                onChange={handleChange}
              />
            </div>
          </div>
          
          {/* Job details */}
          <div className="mb-6">
            <h2 className="text-lg font-medium text-white mb-4">Job Details</h2>
            
            <div>
              <label htmlFor="description" className="form-label">
                Job Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                className="input"
                placeholder="Detailed description of the job"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mt-4">
              <label htmlFor="requirements" className="form-label">
                Requirements
              </label>
              <textarea
                id="requirements"
                name="requirements"
                rows={5}
                className="input"
                placeholder="List all job requirements"
                value={formData.requirements}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mt-4">
              <label className="form-label">Skills</label>
              <div className="flex">
                <input
                  type="text"
                  className="input rounded-r-none"
                  placeholder="Add a skill (e.g. React)"
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                />
                <button
                  type="button"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 rounded-r-md"
                  onClick={addSkill}
                >
                  Add
                </button>
              </div>
              
              {formData.skills.length > 0 && (
                <div className="flex flex-wrap mt-2">
                  {formData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="keyword-tag"
                    >
                      {skill}
                      <button
                        type="button"
                        className="ml-1 text-gray-400 hover:text-gray-200"
                        onClick={() => removeSkill(skill)}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Additional details */}
          <div className="mb-6">
            <h2 className="text-lg font-medium text-white mb-4">Additional Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="experienceLevel" className="form-label">
                  Experience Level
                </label>
                <select
                  id="experienceLevel"
                  name="experienceLevel"
                  className="input"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  required
                >
                  <option value="entry">Entry Level</option>
                  <option value="junior">Junior</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior</option>
                  <option value="lead">Lead</option>
                  <option value="executive">Executive</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="employmentType" className="form-label">
                  Employment Type
                </label>
                <select
                  id="employmentType"
                  name="employmentType"
                  className="input"
                  value={formData.employmentType}
                  onChange={handleChange}
                  required
                >
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                  <option value="temporary">Temporary</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Input
                label="Salary Min"
                name="salary.min"
                type="number"
                placeholder="e.g. 80000"
                value={formData.salary.min}
                onChange={handleChange}
                error={errors.salaryMin}
              />
              
              <Input
                label="Salary Max"
                name="salary.max"
                type="number"
                placeholder="e.g. 120000"
                value={formData.salary.max}
                onChange={handleChange}
                error={errors.salaryMax}
              />
              
              <div>
                <label htmlFor="salary.currency" className="form-label">
                  Currency
                </label>
                <select
                  id="salary.currency"
                  name="salary.currency"
                  className="input"
                  value={formData.salary.currency}
                  onChange={handleChange}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="CAD">CAD</option>
                  <option value="AUD">AUD</option>
                  <option value="INR">INR</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Input
                label="Location"
                name="location"
                placeholder="e.g. San Francisco, CA"
                value={formData.location}
                onChange={handleChange}
                error={errors.location}
                required
              />
              
              <div className="flex items-center mt-8">
                <input
                  id="remote"
                  name="remote"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-600 rounded"
                  checked={formData.remote}
                  onChange={handleChange}
                />
                <label htmlFor="remote" className="ml-2 block text-sm text-gray-300">
                  This is a remote position
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button 
              type="button" 
              variant="secondary"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Job'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}