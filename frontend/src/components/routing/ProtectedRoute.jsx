// src/components/routing/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getToken, isTokenValid, getSafeUserFromToken } from "../../utils/auth";

export default function ProtectedRoute({ children, allowRoles = [] }) {
  const location = useLocation();
  const token = getToken();

  if (!token || !isTokenValid(token)) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const { role } = getSafeUserFromToken(token);
  if (allowRoles.length && !allowRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
