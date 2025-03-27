import React from "react";
import { Navigate } from "react-router-dom";

const AuthRoute = ({ children, isAuthenticated, protect, redirectTo = "/login" }) => {
  if (protect && !isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!protect && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AuthRoute;
