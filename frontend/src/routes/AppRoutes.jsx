import { Navigate, Route, Routes } from "react-router-dom";
import { currentUser } from "../services/api";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import OwnerDashboard from "../pages/owner/OwnerDashboard";
import StoreUserDashboard from "../pages/stores/StoreUserDashboard";
import ProtectedRoute from "./ProtectedRoute";

function homePath() {
  const user = currentUser();
  return user ? (user.role === "ADMIN" ? "/admin" : user.role === "STORE_OWNER" ? "/owner" : "/stores") : "/login";
}

export default function AppRoutes() {
  return <Routes><Route path="/login" element={<LoginPage />} /><Route path="/register" element={<RegisterPage />} /><Route element={<ProtectedRoute roles={["ADMIN"]} />}><Route path="/admin" element={<AdminDashboard />} /></Route><Route element={<ProtectedRoute roles={["USER"]} />}><Route path="/stores" element={<StoreUserDashboard />} /></Route><Route element={<ProtectedRoute roles={["STORE_OWNER"]} />}><Route path="/owner" element={<OwnerDashboard />} /></Route><Route path="*" element={<Navigate to={homePath()} replace />} /></Routes>;
}
