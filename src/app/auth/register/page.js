// src/app/auth/register/page.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'applicant', // Default role
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...userData } = formData;
      
      await register(userData);
      
      // Registration successful, redirect to login
      router.push('/auth/login?registered=true');
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: error.message || 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-dark-400">
      <Card className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="mb-6">
            <Image 
              src="/logo.svg" 
              alt="Resume Shortlister Logo" 
              width={180} 
              height={40} 
              className="mx-auto"
            />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Create an Account</h2>
          <p className="text-gray-400 text-center">
            Join our platform to streamline your recruitment process
          </p>
        </div>
        
        {errors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{errors.general}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
          />
          
          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="name@company.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />
          
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />
          
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
          />
          
          <div className="mb-4">
            <label className="form-label mb-1">Account Type</label>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  id="role-applicant"
                  name="role"
                  type="radio"
                  value="applicant"
                  checked={formData.role === 'applicant'}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-600"
                />
                <label htmlFor="role-applicant" className="ml-2 block text-sm text-gray-300">
                  Applicant
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="role-recruiter"
                  name="role"
                  type="radio"
                  value="recruiter"
                  checked={formData.role === 'recruiter'}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-600"
                />
                <label htmlFor="role-recruiter" className="ml-2 block text-sm text-gray-300">
                  Recruiter/HR
                </label>
              </div>
            </div>
          </div>
          
          <Button 
            type="submit" 
            variant="primary" 
            className="w-full py-2.5"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
          
          <p className="mt-4 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary-500 hover:text-primary-400 font-medium">
              Sign in
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}