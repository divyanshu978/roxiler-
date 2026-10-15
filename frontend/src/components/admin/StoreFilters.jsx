import { inputClass } from "../../utils/constants";
export default function StoreFilters({ filters, onChange }) {
  return <div className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-4"><input className={inputClass} name="name" placeholder="Search name" value={filters.name} onChange={onChange} /><input className={inputClass} name="email" placeholder="Search email" value={filters.email} onChange={onChange} /><input className={inputClass} name="address" placeholder="Search address" value={filters.address} onChange={onChange} /><select className={inputClass} name="sortOrder" value={filters.sortOrder} onChange={onChange}><option value="asc">A-Z</option><option value="desc">Z-A</option></select></div>;
}
