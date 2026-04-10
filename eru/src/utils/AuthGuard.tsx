// src/utils/AuthGuard.js
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface authGuardProps {
  children?: ReactNode;
}

function AuthGuard({ children }: authGuardProps) {
  const token = localStorage.getItem("token");
  return !token ? null : <Navigate to="/login" replace />;
}

export default AuthGuard;
