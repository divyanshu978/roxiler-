import { inputClass } from "../../utils/constants";

export default function Field({ label, ...props }) {
  return <label className="block space-y-1.5 text-sm font-medium text-gray-700"><span>{label}</span><input className={inputClass} {...props} /></label>;
}
