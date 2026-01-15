import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import type { JSX } from "react";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = useAppSelector((s) => s.auth.token);

  if (!token) return <Navigate to="/login" replace />;

  return children;
}
