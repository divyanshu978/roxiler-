import { useEffect, useState } from "react";
import { api } from "../../services/api";
import Message from "../../components/common/Message";
import DataTable from "../../components/common/DataTable";
import StatsCards from "../../components/admin/StatsCards";
import UserFilters from "../../components/admin/UserFilters";
import StoreFilters from "../../components/admin/StoreFilters";
import AddUserForm from "../../components/admin/AddUserForm";
import AddStoreForm from "../../components/admin/AddStoreForm";

export default function AdminDashboard() {
  const [stats, setStats] = useState({}), [users, setUsers] = useState([]), [stores, setStores] = useState([]), [error, setError] = useState(""), [tab, setTab] = useState("users"), [refresh, setRefresh] = useState(0), [notice, setNotice] = useState("");
  const [filters, setFilters] = useState({ name: "", email: "", address: "", role: "", sortBy: "name", sortOrder: "asc" });
  const [userForm, setUserForm] = useState({ name: "", email: "", password: "", address: "", role: "USER" }), [storeForm, setStoreForm] = useState({ name: "", email: "", address: "" });
  useEffect(() => { Promise.all([api("/admin/dashboard"), api(`/admin/users?${new URLSearchParams(filters)}`), api(`/admin/stores?${new URLSearchParams(filters)}`)]).then(([summary, userList, storeList]) => { setStats(summary); setUsers(userList); setStores(storeList); }).catch(err => setError(err.message)); }, [filters, refresh]);
  async function addUser(event) { event.preventDefault(); try { await api("/admin/users", { method: "POST", body: userForm }); setNotice("User added."); setRefresh(value => value + 1); } catch (err) { setError(err.message); } }
  async function addStore(event) { event.preventDefault(); try { await api("/admin/stores", { method: "POST", body: storeForm }); setNotice("Store added."); setRefresh(value => value + 1); } catch (err) { setError(err.message); } }
  return <div className="space-y-6"><div><p className="text-sm font-medium text-gray-500">Overview</p><h1 className="text-3xl font-bold">Admin dashboard</h1></div><Message error={error} success={notice} /><StatsCards stats={stats} /><div className="flex gap-2 border-b border-gray-200"><button className={`border-b-2 px-3 py-3 text-sm font-semibold ${tab === "users" ? "border-black" : "border-transparent text-gray-500"}`} onClick={() => setTab("users")}>Users</button><button className={`border-b-2 px-3 py-3 text-sm font-semibold ${tab === "stores" ? "border-black" : "border-transparent text-gray-500"}`} onClick={() => setTab("stores")}>Stores</button></div>{tab === "users" ? <><UserFilters filters={filters} onChange={event => setFilters({ ...filters, [event.target.name]: event.target.value })} /><DataTable columns={["Name", "Email", "Address", "Role"]} rows={users.map(user => [user.name, user.email, user.address, user.role])} empty="No users found" /><AddUserForm fields={userForm} setFields={setUserForm} onSubmit={addUser} /></> : <><StoreFilters filters={filters} onChange={event => setFilters({ ...filters, [event.target.name]: event.target.value })} /><DataTable columns={["Name", "Email", "Address", "Rating"]} rows={stores.map(store => [store.name, store.email, store.address, store.overallRating])} empty="No stores found" /><AddStoreForm fields={storeForm} setFields={setStoreForm} onSubmit={addStore} /></>}</div>;
}
