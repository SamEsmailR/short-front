// src/app/dashboard/applicant/profile/page.js
'use client';

import { useState, useRef, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { 
  CloudArrowUpIcon, 
  DocumentTextIcon,
  PlusCircleIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { profileAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  
  const [profile, setProfile] = useState(null);
  const [editableProfile, setEditableProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newSkill, setNewSkill] = useState('');
  const [uploadingResume, setUploadingResume] = useState(false);
  
  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await profileAPI.getMyProfile();
        setProfile(response.data.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError('Failed to load profile. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);
  
  // Handle file upload
// Update the handleFileUpload function

const handleFileUpload = async (file) => {
  if (!file) return;
  
  // Check file type
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (!allowedTypes.includes(file.type)) {
    alert('Please upload a PDF or Word document.');
    return;
  }
  
  setUploadingResume(true);
  
  try {
    const formData = new FormData();
    formData.append('resume', file);
    
    const response = await profileAPI.uploadResume(formData);
    
    // Update the profile state with the parsed data from the resume
    const updatedProfile = response.data.data;
    setProfile(updatedProfile);
    
    // Also update the editable profile if in edit mode
    if (isEditing) {
      setEditableProfile(updatedProfile);
    }
    
    alert('Resume uploaded and profile updated successfully!');
  } catch (err) {
    console.error('Resume upload failed:', err);
    alert('Failed to upload resume. Please try again.');
  } finally {
    setUploadingResume(false);
  }
};
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  const handleInputChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };
  
  // Edit profile handlers
  const handleEditToggle = async () => {
    if (isEditing) {
      // Save changes
      try {
        const response = await profileAPI.updateProfile(editableProfile);
        setProfile(response.data.data);
        setIsEditing(false);
      } catch (err) {
        console.error('Failed to update profile:', err);
        alert('Failed to update profile. Please try again.');
      }
    } else {
      // Start editing with current profile data
      setEditableProfile({...profile});
      setIsEditing(true);
    }
  };
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested objects (e.g., contact.phone)
      const [parent, child] = name.split('.');
      setEditableProfile({
        ...editableProfile,
        [parent]: {
          ...editableProfile[parent] || {},
          [child]: value,
        },
      });
    } else {
      setEditableProfile({
        ...editableProfile,
        [name]: value,
      });
    }
  };
  
  const addSkill = () => {
    if (!newSkill.trim()) return;
    
    if (!editableProfile.skills) {
      editableProfile.skills = [];
    }
    
    if (!editableProfile.skills.includes(newSkill.trim())) {
      setEditableProfile({
        ...editableProfile,
        skills: [...editableProfile.skills, newSkill.trim()],
      });
    }
    
    setNewSkill('');
  };
  
  const removeSkill = (skill) => {
    setEditableProfile({
      ...editableProfile,
      skills: editableProfile.skills.filter((s) => s !== skill),
    });
  };
  
  // Experience handlers
  const addExperience = () => {
    const newExperience = {
      id: Date.now().toString(),
      title: '',
      company: '',
      location: '',
      from: '',
      to: '',
      current: false,
      description: '',
    };
    
    if (!editableProfile.experience) {
      editableProfile.experience = [];
    }
    
    setEditableProfile({
      ...editableProfile,
      experience: [...editableProfile.experience, newExperience],
    });
  };
  
  const updateExperience = (id, field, value) => {
    setEditableProfile({
      ...editableProfile,
      experience: editableProfile.experience.map((exp) => 
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };
  
  const removeExperience = (id) => {
    setEditableProfile({
      ...editableProfile,
      experience: editableProfile.experience.filter((exp) => exp.id !== id),
    });
  };
  
  // Education handlers
  const addEducation = () => {
    const newEducation = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      fieldOfStudy: '',
      from: '',
      to: '',
      current: false,
      description: '',
    };
    
    if (!editableProfile.education) {
      editableProfile.education = [];
    }
    
    setEditableProfile({
      ...editableProfile,
      education: [...editableProfile.education, newEducation],
    });
  };
  
  const updateEducation = (id, field, value) => {
    setEditableProfile({
      ...editableProfile,
      education: editableProfile.education.map((edu) => 
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };
  
  const removeEducation = (id) => {
    setEditableProfile({
      ...editableProfile,
      education: editableProfile.education.filter((edu) => edu.id !== id),
    });
  };
  
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
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="text-center">
        <p className="text-gray-400 mb-4">No profile found. Please create one.</p>
        <Button 
          onClick={() => setProfile({
            title: '',
            bio: '',
            location: '',
            contact: { phone: '', website: '', linkedIn: '', github: '' },
            skills: [],
            experience: [],
            education: [],
            certificates: [],
          })}
        >
          Create Profile
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <Button 
          variant={isEditing ? "primary" : "secondary"}
          onClick={handleEditToggle}
        >
          {isEditing ? "Save Changes" : "Edit Profile"}
        </Button>
      </div>
      
      {/* Resume Upload Section */}
      <Card className="mb-6">
        <h2 className="text-lg font-medium text-white mb-4">Resume</h2>
        
        {profile.resume && profile.resume.originalName ? (
          <div className="bg-dark-200 rounded-lg p-4">
            <div className="flex items-center">
              <DocumentTextIcon className="h-10 w-10 text-primary-500 mr-3" />
              <div>
                <h3 className="text-white font-medium">{profile.resume.originalName}</h3>
                <p className="text-sm text-gray-400">
                  Uploaded on {new Date(profile.resume.uploadDate).toLocaleDateString()}
                </p>
              </div>
              <Button 
                variant="secondary" 
                className="ml-auto"
                onClick={triggerFileInput}
                disabled={uploadingResume}
              >
                {uploadingResume ? 'Uploading...' : 'Replace'}
              </Button>
            </div>
          </div>
        ) : (
          <div 
            className={`border-2 border-dashed ${isDragging ? 'border-primary-500' : 'border-dark-100'} rounded-lg p-8 text-center`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-1">Upload your resume</h3>
            <p className="text-sm text-gray-400 mb-4">Drag and drop your file here or click to browse</p>
            <Button 
              variant="primary"
              onClick={triggerFileInput}
              disabled={uploadingResume}
            >
              {uploadingResume ? 'Uploading...' : 'Select File'}
            </Button>
            <p className="mt-2 text-xs text-gray-500">Supported formats: PDF, DOC, DOCX</p>
          </div>
        )}
        
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleInputChange}
        />
      </Card>
      
      {/* Rest of profile sections - basic info, skills, experience, education */}
      {/* These sections remain mostly the same, but use the actual profile data */}
      
      {/* Basic Info Section */}
      <Card className="mb-6">
        <h2 className="text-lg font-medium text-white mb-4">Basic Information</h2>
        
        {isEditing ? (
          <div className="space-y-4">
            <Input
              label="Professional Title"
              name="title"
              placeholder="e.g. Frontend Developer"
              value={editableProfile.title || ''}
              onChange={handleProfileChange}
            />
            
            <div className="form-group">
              <label htmlFor="bio" className="form-label">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                className="input"
                placeholder="Brief description about yourself"
                value={editableProfile.bio || ''}
                onChange={handleProfileChange}
              />
            </div>
            
            <Input
              label="Location"
              name="location"
              placeholder="e.g. New York, NY"
              value={editableProfile.location || ''}
              onChange={handleProfileChange}
            />
            
            <Input
              label="Phone"
              name="contact.phone"
              placeholder="e.g. 555-123-4567"
              value={editableProfile.contact?.phone || ''}
              onChange={handleProfileChange}
            />
            
            <Input
              label="Website"
              name="contact.website"
              placeholder="e.g. https://example.com"
              value={editableProfile.contact?.website || ''}
              onChange={handleProfileChange}
            />
            
            <Input
              label="LinkedIn"
              name="contact.linkedIn"
              placeholder="e.g. https://linkedin.com/in/username"
              value={editableProfile.contact?.linkedIn || ''}
              onChange={handleProfileChange}
            />
            
            <Input
              label="GitHub"
              name="contact.github"
              placeholder="e.g. https://github.com/username"
              value={editableProfile.contact?.github || ''}
              onChange={handleProfileChange}
            />
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-400">Professional Title</h3>
              <p className="text-white">{profile.title || 'Not specified'}</p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-400">Bio</h3>
              <p className="text-white">{profile.bio || 'Not specified'}</p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-400">Location</h3>
              <p className="text-white">{profile.location || 'Not specified'}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400">Phone</h3>
                <p className="text-white">{profile.contact?.phone || 'Not specified'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-400">Website</h3>
                <p className="text-white">{profile.contact?.website || 'Not specified'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-400">LinkedIn</h3>
                <p className="text-white">{profile.contact?.linkedIn || 'Not specified'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-400">GitHub</h3>
                <p className="text-white">{profile.contact?.github || 'Not specified'}</p>
              </div>
            </div>
          </div>
        )}
      </Card>
      
      {/* Skills Section */}
      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-white">Skills</h2>
        </div>
        
        {isEditing ? (
          <div>
            <div className="flex mb-3">
              <input
                type="text"
                className="input rounded-r-none flex-1"
                placeholder="Add a skill (e.g. React)"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newSkill.trim()) {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              <button
                type="button"
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 rounded-r-md"
                onClick={addSkill}
              >
                Add
              </button>
            </div>
            
            <div className="flex flex-wrap">
              {editableProfile.skills && editableProfile.skills.map((skill) => (
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
          </div>
        ) : (
          <div className="flex flex-wrap">
            {profile.skills && profile.skills.length > 0 ? (
              profile.skills.map((skill) => (
                <span key={skill} className="keyword-tag">
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-gray-400">No skills added yet</p>
            )}
          </div>
        )}
      </Card>
      
      {/* The experience and education sections would follow a similar pattern */}
    </div>
  );
}