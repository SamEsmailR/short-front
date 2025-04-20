// src/app/auth/login/page.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    
    try {
      const user = await login(formData);
      
      // Redirect based on user role
      if (user.role === 'recruiter') {
        router.push('/dashboard/recruiter/jobs');
      } else {
        router.push('/dashboard/applicant/jobs');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ auth: error.message || 'Invalid email or password' });
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
          <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400 text-center">
            Enter your credentials to access your account
          </p>
        </div>
        
        {errors.auth && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{errors.auth}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
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
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-600 rounded bg-dark-300"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                Remember me
              </label>
            </div>
            
            <Link href="/auth/forgot-password" className="text-sm text-primary-500 hover:text-primary-400">
              Forgot password?
            </Link>
          </div>
          
          <Button 
            type="submit" 
            variant="primary" 
            className="w-full py-2.5"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
          
          <p className="mt-4 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-primary-500 hover:text-primary-400 font-medium">
              Create an account
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}