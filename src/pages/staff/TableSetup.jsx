import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ensureTableToken,
  generateTables,
  getCustomerLink,
  getTables,
  refreshTableToken,
} from "../../services/tableService";

function qrUrl(link) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=14&data=${encodeURIComponent(link)}`;
}

export default function TableSetup() {
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [count, setCount] = useState(12);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState("");

  async function loadTables() {
    setLoading(true);
    setTables(await getTables());
    setLoading(false);
  }

  useEffect(() => {
    loadTables();
  }, []);

  const readyTables = useMemo(
    () => tables.filter((table) => table.token),
    [tables]
  );

  async function handleGenerate() {
    setSaving(true);
    try {
      await generateTables(count);
      await loadTables();
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleCopy(table) {
    const link = getCustomerLink(table);
    await navigator.clipboard.writeText(link);
    setCopied(table.id);
    setTimeout(() => setCopied(""), 1600);
  }

  async function handleEnsureToken(tableId) {
    await ensureTableToken(tableId);
    await loadTables();
  }

  async function handleRefreshToken(tableId) {
    if (!window.confirm(`Create a new QR link for Table ${tableId}? Old printed QR codes for this table will stop working.`)) {
      return;
    }

    await refreshTableToken(tableId);
    await loadTables();
  }

  return (
    <div className="min-h-screen bg-[#f6efe5] text-stone-950">
      <div className="sticky top-0 z-40 border-b border-stone-200/70 bg-[#f6efe5]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-amber-700">Restaurant Setup</p>
            <h1 className="text-3xl font-black tracking-tight md:text-5xl">Tables & QR Links</h1>
          </div>
          <button
            onClick={() => navigate("/admin")}
            className="rounded-2xl bg-stone-950 px-5 py-3 font-bold text-white shadow-lg shadow-stone-950/15"
          >
            Back to Admin
          </button>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-5 py-8">
        <section className="grid gap-5 rounded-[2rem] bg-stone-950 p-6 text-white shadow-2xl shadow-stone-950/10 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-300">Safe customer links</p>
            <h2 className="mt-2 text-3xl font-black">Generate one masked QR link per table</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-300">
              Customers see a private table token instead of a simple table number. This prevents casual URL editing like changing table=1 to table=2.
            </p>
          </div>

          <div className="rounded-3xl bg-white/10 p-4">
            <label className="text-xs font-black uppercase tracking-[0.2em] text-stone-300">Number of tables</label>
            <div className="mt-3 flex gap-3">
              <input
                type="number"
                min="1"
                max="250"
                value={count}
                onChange={(event) => setCount(event.target.value)}
                className="w-28 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-xl font-black text-white outline-none"
              />
              <button
                onClick={handleGenerate}
                disabled={saving}
                className="rounded-2xl bg-amber-400 px-5 py-3 font-black text-stone-950 transition hover:bg-amber-300 disabled:opacity-60"
              >
                {saving ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>
        </section>

        <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold text-stone-600">
          <span className="rounded-full bg-white px-4 py-2 shadow-sm">{tables.length} total table docs</span>
          <span className="rounded-full bg-white px-4 py-2 shadow-sm">{readyTables.length} QR-ready links</span>
        </div>

        {loading ? (
          <div className="mt-8 rounded-3xl bg-white p-8 text-stone-500">Loading tables...</div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {tables.map((table) => {
              const link = table.token ? getCustomerLink(table) : "";

              return (
                <article key={table.id} className="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-black/5">
                  <div className="flex items-center justify-between bg-stone-950 p-5 text-white">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">Customer QR</p>
                      <h2 className="text-3xl font-black">Table {table.id}</h2>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-black ${table.status === "OPEN" ? "bg-emerald-300 text-emerald-950" : "bg-white/10 text-stone-300"}`}>
                      {table.status || "CLOSED"}
                    </span>
                  </div>

                  <div className="p-5">
                    {table.token ? (
                      <>
                        <div className="flex justify-center rounded-3xl bg-stone-50 p-5">
                          <img src={qrUrl(link)} alt={`QR code for Table ${table.id}`} className="h-44 w-44" />
                        </div>
                        <p className="mt-4 break-all rounded-2xl bg-stone-50 p-3 text-xs font-semibold text-stone-500">{link}</p>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                          <button onClick={() => handleCopy(table)} className="rounded-2xl bg-amber-400 py-3 font-black text-stone-950">
                            {copied === table.id ? "Copied" : "Copy Link"}
                          </button>
                          <a href={qrUrl(link)} download={`caffein-table-${table.id}-qr.png`} className="rounded-2xl bg-stone-950 py-3 text-center font-black text-white">
                            Download QR
                          </a>
                        </div>
                        <button onClick={() => handleRefreshToken(table.id)} className="mt-3 w-full rounded-2xl border border-red-200 py-3 text-sm font-black text-red-700">
                          Reset Link
                        </button>
                      </>
                    ) : (
                      <button onClick={() => handleEnsureToken(table.id)} className="w-full rounded-2xl bg-stone-950 py-4 font-black text-white">
                        Create QR Link
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}