import React from "react";
import { Navigate } from "react-router-dom";

import { isAuthenticated, hasRole, getUser } from "../api/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const isAuth = isAuthenticated();
  const userHasRole = requiredRole ? hasRole(requiredRole) : true;
  const user = getUser();

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !userHasRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="mt-2">
            You need to be a {requiredRole.toLowerCase()} to access this page.
          </p>
          <p>Your current role is: {user?.role.toLowerCase()}</p>
        </div>
      </div>
    );
  }
  return <>{children}</>;
};

export default ProtectedRoute;
