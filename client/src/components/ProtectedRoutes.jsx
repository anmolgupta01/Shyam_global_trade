import React from "react";
import { useAuth } from "../contexts/AuthContext";
import LoginPage from "./LoginPage"; 

const ProtectedRoutes = ({ children, requireAdmin = false }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: "flex", justifyContent: "center", alignItems: "center",
        height: "100vh"
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  if (requireAdmin && !isAdmin()) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#e74c3c" }}>
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoutes; // ✅ default export
