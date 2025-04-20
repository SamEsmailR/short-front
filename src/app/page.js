// src/app/page.js
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, role } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    // Redirect if authenticated
    if (isAuthenticated) {
      if (role === 'recruiter') {
        router.push('/dashboard/recruiter/jobs');
      } else {
        router.push('/dashboard/applicant/jobs');
      }
    }
  }, [isAuthenticated, role, router]);

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700 min-h-screen text-white">
      {/* Header/Navigation */}
      <header className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-white">Resume<span className="text-primary-500">Shortlister</span></h1>
        </div>
        
        <div className="flex space-x-4">
          <Link 
            href="/auth/login" 
            className="px-4 py-2 rounded-md bg-dark-200 hover:bg-dark-100 transition-colors text-white"
          >
            Log in
          </Link>
          <Link 
            href="/auth/register" 
            className="px-4 py-2 rounded-md bg-primary-600 hover:bg-primary-700 transition-colors text-white"
          >
            Register
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-6 py-20 max-w-7xl mx-auto">
        <div className="flex flex-col justify-center">
          <div className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-primary-900 text-primary-500 mb-4">
            powered by OpenAI 
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Accelerate talent match, find right talents, amplify <span className="text-primary-500 border-b-2 border-primary-500">Quality</span>
          </h1>
          
          <p className="text-lg text-gray-300 mb-8">
            AI-powered recruitment platform that matches the right candidates to your job openings. 
            Save time, reduce bias, and find the best talent faster.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/auth/register"
              className="btn btn-primary px-8 py-3 text-center"
            >
              Try for Free
            </Link>
            <Link
              href="#demo"
              className="btn btn-secondary px-8 py-3 text-center flex items-center justify-center gap-2"
            >
              See a quick demo
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
              </svg>
            </Link>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center justify-center">
          <div className="relative w-full max-w-lg">
            <div className="bg-dark-300 rounded-2xl p-6 shadow-xl border border-dark-200">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-center mb-1">Candidate Evaluation</h3>
                <p className="text-xs text-gray-400 text-center">Overall evaluation of the candidate</p>
              </div>
              
              {/* Diamond chart visualization */}
              <div className="relative h-48 w-48 mx-auto mb-4">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <polygon points="50,10 90,50 50,90 10,50" fill="#E67E22" fillOpacity="0.8" />
                  <text x="50" y="35" textAnchor="middle" className="text-xs text-white">Keywords</text>
                  <text x="75" y="53" textAnchor="middle" className="text-xs text-white">Experience</text>
                  <text x="50" y="75" textAnchor="middle" className="text-xs text-white">Projects</text>
                  <text x="25" y="53" textAnchor="middle" className="text-xs text-white">Skills</text>
                </svg>
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-300">Overall Score</span>
                  <span className="text-sm font-medium text-primary-500">74%</span>
                </div>
                <div className="w-full bg-dark-400 rounded-full h-2">
                  <div className="bg-primary-600 h-2 rounded-full" style={{ width: "74%" }}></div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2">Relevant Keyword Matches</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-dark-400 text-primary-500 text-xs px-2 py-1 rounded">ReactJS</span>
                  <span className="bg-dark-400 text-primary-500 text-xs px-2 py-1 rounded">JavaScript</span>
                  <span className="bg-dark-400 text-primary-500 text-xs px-2 py-1 rounded">Node.js</span>
                  <span className="bg-dark-400 text-primary-500 text-xs px-2 py-1 rounded">TypeScript</span>
                </div>
              </div>
            </div>
            
            {/* Decorative dots */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="bg-dark-300 py-20 px-6" id="demo">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-dark-200 rounded-xl p-6 border border-dark-100">
              <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.5 20.25h-9.75a.75.75 0 010-1.5h9.75a.75.75 0 010 1.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">AI Resume Parsing</h3>
              <p className="text-gray-400">
                Automatically extract information from resumes and create structured profiles for applicants.
              </p>
            </div>
            
            <div className="bg-dark-200 rounded-xl p-6 border border-dark-100">
              <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Intelligent Shortlisting</h3>
              <p className="text-gray-400">
                Automatically rank and shortlist candidates based on job requirements and skills match.
              </p>
            </div>
            
            <div className="bg-dark-200 rounded-xl p-6 border border-dark-100">
              <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Detailed Analytics</h3>
              <p className="text-gray-400">
                Get insights on candidate strengths, weaknesses, and match percentage with job requirements.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Impact Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-3 text-white">
            Are we even making any <span className="text-primary-500 italic">Impact</span>?
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            ...well maybe not much. But we can always take the first step, right?
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-dark-300 rounded-xl p-6">
              <h3 className="text-3xl font-bold text-primary-500 mb-2">85%</h3>
              <p className="text-gray-300">Reduction in time spent screening resumes</p>
            </div>
            
            <div className="bg-dark-300 rounded-xl p-6">
              <h3 className="text-3xl font-bold text-primary-500 mb-2">73%</h3>
              <p className="text-gray-300">Increase in candidate quality for interviews</p>
            </div>
            
            <div className="bg-dark-300 rounded-xl p-6">
              <h3 className="text-3xl font-bold text-primary-500 mb-2">50%</h3>
              <p className="text-gray-300">Reduction in time-to-hire for open positions</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-dark-300 py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to transform your hiring process?</h2>
          <p className="text-lg text-gray-300 mb-8">
            Join thousands of companies using Resume Shortlister to find the best talent faster.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="btn btn-primary px-8 py-3"
            >
              Get Started for Free
            </Link>
            <Link
              href="/auth/login"
              className="btn btn-secondary px-8 py-3"
            >
              Log in
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-dark-200 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-xl font-bold text-white">Resume<span className="text-primary-500">Shortlister</span></h1>
              <p className="text-sm text-gray-400">© 2025 All rights reserved</p>
            </div>
            
            <div className="flex space-x-6">
              <Link href="#" className="text-gray-400 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}