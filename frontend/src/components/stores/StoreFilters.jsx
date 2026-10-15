import { inputClass } from "../../utils/constants";
export default function StoreFilters({ filters, setFilters }) {
  return <div className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-2"><input className={inputClass} placeholder="Search by name" value={filters.name} onChange={event => setFilters({ ...filters, name: event.target.value })} /><input className={inputClass} placeholder="Search by address" value={filters.address} onChange={event => setFilters({ ...filters, address: event.target.value })} /></div>;
}
