import "./App.css";
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoutes";
import  LoadingSpinner  from "./components/ui/LoadingSpinner";
import { setupAxiosInterceptors } from "./services/api";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const Products = lazy(() => import("./pages/Products"));
const AdminDashboard = lazy(() => import("./components/admin/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Setup axios interceptors
setupAxiosInterceptors();

// Loading fallback component
const PageLoader = ({ message = "Loading page..." }) => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner message={message} />
  </div>
);

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
      <p className="text-gray-600 mb-6">{error.message}</p>
      <button 
        onClick={resetErrorBoundary}
        className="px-6 py-3 bg-[#254F7E] text-white rounded hover:bg-[#1e3f66] transition-colors"
      >
        Try again
      </button>
    </div>
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Routes>
              {/* Public routes */}
              <Route 
                path="/" 
                element={
                  <Suspense fallback={<PageLoader message="Loading home..." />}>
                    <Home />
                  </Suspense>
                } 
              />
              <Route 
                path="/aboutus" 
                element={
                  <Suspense fallback={<PageLoader message="Loading about us..." />}>
                    <AboutUs />
                  </Suspense>
                } 
              />
              <Route 
                path="/contactus" 
                element={
                  <Suspense fallback={<PageLoader message="Loading contact..." />}>
                    <ContactUs />
                  </Suspense>
                } 
              />
              <Route 
                path="/products" 
                element={
                  <Suspense fallback={<PageLoader message="Loading products..." />}>
                    <Products />
                  </Suspense>
                } 
              />

              {/* Protected admin route */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <Suspense fallback={<PageLoader message="Loading admin dashboard..." />}>
                      <AdminDashboard />
                    </Suspense>
                  </ProtectedRoute>
                }
              />

              {/* 404 Not Found */}
              <Route 
                path="/404" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <NotFound />
                  </Suspense>
                } 
              />

              {/* Redirect unknown routes to 404 */}
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </ErrorBoundary>
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
