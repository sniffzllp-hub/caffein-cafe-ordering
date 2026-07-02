import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";

import { db } from "../../services/firebase";
import TableCard from "../../components/staff/TableCard";

export default function StaffDashboard() {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Tables"), (snapshot) => {
      const data = snapshot.docs.map((tableDoc) => ({
        id: tableDoc.id,
        ...tableDoc.data(),
      }));

      data.sort((a, b) => Number(a.id) - Number(b.id));
      setTables(data);
    });

    return () => unsubscribe();
  }, []);

  const openTables = useMemo(() => tables.filter((table) => table.status === "OPEN"), [tables]);
  const floorTotal = openTables.reduce((sum, table) => sum + Number(table.total || 0), 0);

  return (
    <div className="min-h-screen bg-[#f5f0e8] text-stone-950">
      <header className="sticky top-0 z-50 border-b border-stone-200/70 bg-[#f5f0e8]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-amber-700">Cashier Dashboard</p>
            <h1 className="text-4xl font-black tracking-tight">Live Orders</h1>
          </div>
          <p className="max-w-md text-sm font-semibold leading-6 text-stone-500">
            Staff can view live tables and manage active orders here. Admin tools are kept separate.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8">
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.75rem] bg-stone-950 p-6 text-white shadow-xl shadow-stone-950/10">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-amber-300">Open Tables</p>
            <h2 className="mt-3 text-5xl font-black">{openTables.length}</h2>
          </div>
          <div className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-black/5">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-stone-400">Active Bill Value</p>
            <h2 className="mt-3 text-5xl font-black">₹{floorTotal}</h2>
          </div>
          <div className="rounded-[1.75rem] bg-amber-100 p-6 text-amber-950 shadow-sm ring-1 ring-black/5">
            <p className="text-sm font-black uppercase tracking-[0.2em] opacity-60">Total Tables</p>
            <h2 className="mt-3 text-5xl font-black">{tables.length}</h2>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-stone-400">Floor</p>
              <h2 className="text-2xl font-black">Tables needing attention</h2>
            </div>
          </div>

          {openTables.length === 0 ? (
            <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm ring-1 ring-black/5">
              <div className="text-6xl">☕</div>
              <h3 className="mt-4 text-2xl font-black">No open tables right now</h3>
              <p className="mt-2 text-stone-500">New customer orders will appear here live.</p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {openTables.map((table) => <TableCard key={table.id} table={table} />)}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}