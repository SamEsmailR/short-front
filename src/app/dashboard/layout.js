// src/app/dashboard/layout.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  BriefcaseIcon, 
  UsersIcon, 
  ChartBarIcon, 
  UserIcon, 
  Cog6ToothIcon, 
  ArrowLeftOnRectangleIcon 
} from '@heroicons/react/24/outline';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // This is a placeholder - in a real app, you'd get this from context
  const userRole = 'recruiter'; // or 'applicant'
  
  const recruiterNav = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Jobs', href: '/dashboard/recruiter/jobs', icon: BriefcaseIcon },
    { name: 'Applications', href: '/dashboard/recruiter/applications', icon: UsersIcon },
    { name: 'Analytics', href: '/dashboard/recruiter/analytics', icon: ChartBarIcon },
    { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
  ];
  
  const applicantNav = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Find Jobs', href: '/dashboard/applicant/jobs', icon: BriefcaseIcon },
    { name: 'My Applications', href: '/dashboard/applicant/applications', icon: UsersIcon },
    { name: 'Profile', href: '/dashboard/applicant/profile', icon: UserIcon },
    { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
  ];
  
  const navigation = userRole === 'recruiter' ? recruiterNav : applicantNav;
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="flex h-screen bg-dark-400">
      {/* Sidebar */}
      <div className={`bg-dark-300 text-white ${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out`}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 p-4 border-b border-dark-200">
            {isSidebarOpen ? (
              <Image 
                src="/logo.svg" 
                alt="Resume Shortlister Logo" 
                width={150} 
                height={30} 
              />
            ) : (
              <Image 
                src="/logo-icon.svg" 
                alt="Logo Icon" 
                width={30} 
                height={30} 
              />
            )}
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 py-4 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    isActive 
                      ? 'bg-primary-700 text-white' 
                      : 'text-gray-300 hover:bg-dark-200'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                >
                  <item.icon 
                    className={`${
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                    } mr-3 h-6 w-6`} 
                    aria-hidden="true" 
                  />
                  {isSidebarOpen && item.name}
                </Link>
              );
            })}
          </nav>
          
          {/* Profile section */}
          <div className="p-4 border-t border-dark-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
                  <span className="text-white font-medium text-sm">JD</span>
                </div>
              </div>
              {isSidebarOpen && (
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">John Doe</p>
                  <p className="text-xs text-gray-400">{userRole === 'recruiter' ? 'Recruiter' : 'Applicant'}</p>
                </div>
              )}
            </div>
            <button 
              className="mt-4 w-full flex items-center justify-center px-4 py-2 text-sm text-white bg-dark-200 rounded-md hover:bg-dark-100"
              onClick={() => console.log('Logout clicked')}
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
              {isSidebarOpen && 'Logout'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-dark-200 border-b border-dark-100 h-16 flex items-center px-6">
          <button
            onClick={toggleSidebar}
            className="text-gray-400 hover:text-white focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="ml-4 text-white font-medium">
            {pathname === '/dashboard' 
              ? 'Dashboard' 
              : pathname.split('/').pop().charAt(0).toUpperCase() + pathname.split('/').pop().slice(1)}
          </div>
          
          <div className="ml-auto flex items-center space-x-4">
            <button className="text-gray-400 hover:text-white focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button className="text-gray-400 hover:text-white focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </header>
        
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-dark-400 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}