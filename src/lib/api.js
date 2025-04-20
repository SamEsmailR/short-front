// src/lib/api.js
import axios from 'axios';
import { getToken, removeToken } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://short-back-5vsc.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 errors (unauthorized)
    if (error.response && error.response.status === 401) {
      removeToken();
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
  logout: () => api.get('/auth/logout'),
};

// Profile endpoints
export const profileAPI = {
  getMyProfile: () => api.get('/profiles/me'),
  updateProfile: (profileData) => api.put('/profiles', profileData),
  uploadResume: (formData) => api.post('/profiles/resume', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  addExperience: (expData) => api.put('/profiles/experience', expData),
  deleteExperience: (expId) => api.delete(`/profiles/experience/${expId}`),
  addEducation: (eduData) => api.put('/profiles/education', eduData),
  deleteEducation: (eduId) => api.delete(`/profiles/education/${eduId}`),
};

// Job endpoints
export const jobAPI = {
  getJobs: (params) => api.get('/jobs', { params }),
  getJob: (id) => api.get(`/jobs/${id}`),
  createJob: (jobData) => api.post('/jobs', jobData),
  updateJob: (id, jobData) => api.put(`/jobs/${id}`, jobData),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  getMyJobs: () => api.get('/jobs/recruiter/my-jobs'),
};

// Application endpoints
export const applicationAPI = {
  applyForJob: (jobId, applicationData) => api.post(`/applications/${jobId}`, applicationData),
  getMyApplications: () => api.get('/applications/my-applications'),
  getJobApplications: (jobId) => api.get(`/applications/job/${jobId}`),
  getApplication: (id) => api.get(`/applications/${id}`),
  updateApplicationStatus: (id, statusData) => api.put(`/applications/${id}`, statusData),
  deleteApplication: (id) => api.delete(`/applications/${id}`),
  getShortlistedApplications: (jobId) => api.get(`/applications/job/${jobId}/shortlisted`),
};

// AI endpoints
export const aiAPI = {
  triggerShortlisting: (jobId) => api.post(`/ai/shortlist/${jobId}`),
  analyzeApplication: (applicationId) => api.post(`/ai/analyze/${applicationId}`),
};

export default api;
