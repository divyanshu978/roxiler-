import { useEffect, useState } from "react";
import { api } from "../../services/api";
import DataTable from "../../components/common/DataTable";
import Message from "../../components/common/Message";
import PasswordCard from "../../components/common/PasswordCard";
export default function OwnerDashboard() {
  const [stores, setStores] = useState([]), [error, setError] = useState("");
  useEffect(() => { api("/owner/dashboard").then(setStores).catch(err => setError(err.message)); }, []);
  return <div className="space-y-6"><div><p className="text-sm font-medium text-gray-500">Store owner</p><h1 className="text-3xl font-bold">Your store dashboard</h1></div><Message error={error} />{stores.map(store => <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm" key={store.id}><div className="flex flex-col justify-between gap-3 sm:flex-row"><div><h2 className="text-xl font-semibold">{store.name}</h2><p className="text-sm text-gray-500">{store.address}</p></div><div className="rounded-lg bg-gray-100 px-4 py-3 text-center"><p className="text-xs text-gray-500">Average rating</p><p className="text-2xl font-bold">{store.averageRating || "—"}</p></div></div><div className="mt-6"><h3 className="font-semibold">Submitted ratings</h3><DataTable columns={["User", "Email", "Rating"]} rows={store.ratings.map(rating => [rating.user.name, rating.user.email, rating.score])} empty="No ratings yet" /></div></section>)}{!stores.length && !error && <p className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500">No store is assigned to your account.</p>}<PasswordCard /></div>;
}
