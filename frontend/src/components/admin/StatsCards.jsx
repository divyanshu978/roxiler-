export default function StatsCards({ stats }) {
  return <div className="grid grid-cols-1 gap-4 md:grid-cols-3">{[["Users", stats.totalUsers], ["Stores", stats.totalStores], ["Ratings", stats.totalRatings]].map(([label, value]) => <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm" key={label}><p className="text-sm text-gray-500">{label}</p><p className="mt-2 text-3xl font-bold">{value ?? "—"}</p></div>)}</div>;
}
