import { useState } from "react";
import { api } from "../../services/api";
import { buttonClass, inputClass } from "../../utils/constants";
import Message from "./Message";

export default function PasswordCard() {
  const [password, setPassword] = useState(""), [message, setMessage] = useState({}), [busy, setBusy] = useState(false);
  async function submit(event) { event.preventDefault(); setMessage({}); setBusy(true); try { await api("/auth/password", { method: "PATCH", body: { password } }); setPassword(""); setMessage({ success: "Password updated successfully." }); } catch (error) { setMessage({ error: error.message }); } finally { setBusy(false); } }
  return <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"><h2 className="font-semibold">Update password</h2><form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={submit}><input className={`${inputClass} sm:max-w-xs`} type="password" placeholder="New password" minLength={8} maxLength={16} value={password} onChange={event => setPassword(event.target.value)} required /><button className={buttonClass} disabled={busy}>{busy ? "Saving..." : "Save password"}</button></form><div className="mt-3"><Message {...message} /></div></section>;
}
