import { useEffect, useState } from "react";
import { api } from "../../services/api";
import Message from "../../components/common/Message";
import PasswordCard from "../../components/common/PasswordCard";
import StoreFilters from "../../components/stores/StoreFilters";
import StoreCard from "../../components/stores/StoreCard";

export default function StoreUserDashboard() {
  const [stores, setStores] = useState([]), [filters, setFilters] = useState({ name: "", address: "" }), [error, setError] = useState(""), [notice, setNotice] = useState("");
  async function load() { try { setStores(await api(`/stores?${new URLSearchParams(filters)}`)); } catch (err) { setError(err.message); } }
  useEffect(() => { load(); }, [filters]);
  async function rate(id, score) { try { await api(`/stores/${id}/ratings`, { method: "PUT", body: { score: Number(score) } }); setNotice("Rating saved."); load(); } catch (err) { setError(err.message); } }
  return <div className="space-y-6"><div><p className="text-sm font-medium text-gray-500">Discover stores</p><h1 className="text-3xl font-bold">Rate a store</h1></div><Message error={error} success={notice} /><StoreFilters filters={filters} setFilters={setFilters} /><div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">{stores.map(store => <StoreCard key={store.id} store={store} onRate={rate} />)}{!stores.length && <p className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500 md:col-span-2 lg:col-span-3">No stores found.</p>}</div><PasswordCard /></div>;
}
