import { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { api, clearSession, currentUser } from "../services/api";
import { secondaryButton } from "../utils/constants";

export default function MainLayout() {
  const navigate = useNavigate(), location = useLocation(), user = currentUser();
  useEffect(() => { const logout = () => navigate("/login"); window.addEventListener("roxiler:logout", logout); return () => window.removeEventListener("roxiler:logout", logout); }, [navigate]);
  async function signOut() { try { await api("/auth/logout", { method: "POST" }); } finally { clearSession(); navigate("/login"); } }
  const link = user.role === "ADMIN" ? { to: "/admin", label: "Admin dashboard" } : user.role === "STORE_OWNER" ? { to: "/owner", label: "Owner dashboard" } : { to: "/stores", label: "Stores" };
  return <div className="min-h-screen bg-gray-50"><header className="border-b border-gray-200 bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8"><Link to={link.to} className="text-xl font-bold tracking-tight">Roxiler</Link><nav className="flex items-center gap-3"><Link className={`hidden text-sm font-medium sm:block ${location.pathname === link.to ? "text-black" : "text-gray-500 hover:text-black"}`} to={link.to}>{link.label}</Link><div className="hidden text-right sm:block"><p className="text-sm font-semibold">{user.name}</p><p className="text-xs text-gray-500">{user.role.replace("_", " ")}</p></div><button className={secondaryButton} onClick={signOut}>Log out</button></nav></div></header><main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><Outlet /></main></div>;
}
