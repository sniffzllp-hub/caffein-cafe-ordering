import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getRestaurantAnalytics } from "../../services/analyticsService";

function StatCard({ label, value, helper, tone = "amber" }) {
  const tones = {
    amber: "from-amber-100 to-orange-50 text-amber-950",
    green: "from-emerald-100 to-teal-50 text-emerald-950",
    blue: "from-sky-100 to-indigo-50 text-sky-950",
    stone: "from-stone-100 to-neutral-50 text-stone-950",
  };

  return (
    <div className={`rounded-[1.75rem] bg-gradient-to-br ${tones[tone]} p-6 shadow-sm ring-1 ring-black/5`}>
      <p className="text-sm font-bold uppercase tracking-[0.18em] opacity-60">{label}</p>
      <h2 className="mt-3 text-4xl font-black tracking-tight">{value}</h2>
      {helper && <p className="mt-2 text-sm font-medium opacity-65">{helper}</p>}
    </div>
  );
}

export default function AnalyticsDashboard() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setAnalytics(await getRestaurantAnalytics());
      } catch (err) {
        console.error(err);
        setError("Could not load analytics. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-stone-100 p-8 text-stone-700">Loading analytics...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-stone-100 p-8 text-red-700">{error}</div>;
  }

  const { totals, topItems, recentOrders, openTables } = analytics;

  return (
    <div className="min-h-screen bg-[#f5f0e8] text-stone-950">
      <div className="sticky top-0 z-40 border-b border-stone-200/70 bg-[#f5f0e8]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-amber-700">Admin Analytics</p>
            <h1 className="text-3xl font-black tracking-tight md:text-5xl">Restaurant Pulse</h1>
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
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Today Revenue" value={`₹${totals.todaysRevenue}`} helper={`${totals.todaysOrders} order(s) today`} />
          <StatCard label="Open Tables" value={totals.openTables} helper={`${totals.totalTables} total tables`} tone="green" />
          <StatCard label="Lifetime Sales" value={`₹${totals.lifetimeRevenue}`} helper={`${totals.paidOrders} paid bills`} tone="blue" />
          <StatCard label="Avg Order" value={`₹${totals.averageOrderValue}`} helper="Across recorded orders" tone="stone" />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-black/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.22em] text-stone-400">Menu intelligence</p>
                <h2 className="mt-1 text-2xl font-black">Top selling items</h2>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {topItems.length === 0 && <p className="text-stone-500">No item sales yet.</p>}
              {topItems.map((item, index) => (
                <div key={item.id} className="flex items-center gap-4 rounded-2xl bg-stone-50 p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 font-black text-amber-900">
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-black">{item.name}</h3>
                    <p className="text-sm text-stone-500">{item.quantity} sold</p>
                  </div>
                  <div className="font-black">₹{item.revenue}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] bg-stone-950 p-6 text-white shadow-sm">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-amber-300">Floor status</p>
            <h2 className="mt-1 text-2xl font-black">Open tables now</h2>

            <div className="mt-6 space-y-3">
              {openTables.length === 0 && <p className="text-stone-400">No tables are open right now.</p>}
              {openTables.map((table) => (
                <div key={table.id} className="flex items-center justify-between rounded-2xl bg-white/8 p-4">
                  <div>
                    <h3 className="font-black">Table {table.id}</h3>
                    <p className="text-sm text-stone-400">{table.mobile || "No mobile"}</p>
                  </div>
                  <div className="text-xl font-black text-amber-200">₹{table.total || 0}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-black/5">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-stone-400">Recent activity</p>
          <h2 className="mt-1 text-2xl font-black">Latest orders</h2>

          <div className="mt-6 overflow-hidden rounded-2xl border border-stone-100">
            {recentOrders.length === 0 && <p className="p-5 text-stone-500">No orders yet.</p>}
            {recentOrders.map((order) => (
              <div key={order.id} className="grid gap-3 border-b border-stone-100 p-4 last:border-b-0 md:grid-cols-4 md:items-center">
                <div className="font-black">Table {order.table}</div>
                <div className="text-sm text-stone-500">{order.mobile || "No mobile"}</div>
                <div className="text-sm font-bold uppercase tracking-wide text-stone-400">{order.status || "OPEN"}</div>
                <div className="text-right text-xl font-black">₹{order.total || 0}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}