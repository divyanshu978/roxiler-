import { Navigate } from "react-router-dom";
import { currentUser } from "../services/api";
import MainLayout from "../layouts/MainLayout";

export default function ProtectedRoute({ roles }) {
  const user = currentUser();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <MainLayout />;
}
