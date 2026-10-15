import { buttonClass } from "../../utils/constants";
import Field from "../common/Field";
export default function AddStoreForm({ fields, setFields, onSubmit }) {
  const update = event => setFields({ ...fields, [event.target.name]: event.target.value });
  return <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"><h2 className="font-semibold">Add store</h2><form className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2" onSubmit={onSubmit}><Field label="Name" name="name" value={fields.name} onChange={update} required /><Field label="Email" name="email" type="email" value={fields.email} onChange={update} required /><Field label="Address" name="address" value={fields.address} onChange={update} maxLength={400} required /><div className="md:col-span-2"><button className={buttonClass}>Add</button></div></form></section>;
}
