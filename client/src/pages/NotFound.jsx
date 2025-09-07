import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | Shyam International</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
      </Helmet>
      
      <div className="min-h-screen bg-white">
        <Navbar />
        
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-6xl font-bold text-[#254F7E] mb-4">404</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
            <p className="text-gray-600 mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <Link 
              to="/" 
              className="bg-[#254F7E] text-white px-8 py-3 rounded hover:bg-[#1e3f66] transition-colors inline-block"
            >
              Go Home
            </Link>
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default NotFound;
