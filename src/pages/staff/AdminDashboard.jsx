import { useNavigate } from "react-router-dom";

const adminModules = [
  {
    title: "Menu Studio",
    description: "Products, categories, pricing, availability and images.",
    icon: "🍽️",
    path: "/menu-studio",
    tone: "bg-amber-100 text-amber-950",
  },
  {
    title: "Analytics",
    description: "Revenue, open tables, top items and recent order activity.",
    icon: "📊",
    path: "/analytics",
    tone: "bg-sky-100 text-sky-950",
  },
  {
    title: "Tables & QR",
    description: "Create masked links and printable QR codes for every table.",
    icon: "▦",
    path: "/table-setup",
    tone: "bg-emerald-100 text-emerald-950",
  },
  {
    title: "Live Orders",
    description: "Open the cashier floor view and manage active tables.",
    icon: "🧾",
    path: "/staff",
    tone: "bg-stone-100 text-stone-950",
  },
];

const roadmapModules = ["Staff Roles", "Coupons", "Taxes", "Settings"];

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f5f0e8] text-stone-950">
      <section className="relative overflow-hidden bg-stone-950 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.25),transparent_34%)]" />
        <div className="relative mx-auto max-w-7xl px-5 py-10 md:py-14">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.3em] text-amber-300">Caffein Cafe OS</p>
              <h1 className="mt-4 max-w-3xl text-5xl font-black tracking-tight md:text-7xl">Admin command center</h1>
              <p className="mt-5 max-w-2xl text-sm leading-6 text-stone-300 md:text-base">
                Manage the guest menu, table QR codes, live operations and business pulse from one clean workspace.
              </p>
            </div>

            <button
              onClick={() => navigate("/staff")}
              className="rounded-2xl bg-amber-400 px-6 py-4 font-black text-stone-950 shadow-lg shadow-amber-950/30 transition hover:bg-amber-300"
            >
              Open Live Orders
            </button>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {adminModules.map((module) => (
            <button
              key={module.title}
              onClick={() => navigate(module.path)}
              className="group rounded-[2rem] bg-white p-6 text-left shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-3xl ${module.tone}`}>
                {module.icon}
              </div>
              <h2 className="mt-5 text-2xl font-black tracking-tight">{module.title}</h2>
              <p className="mt-2 min-h-16 text-sm leading-6 text-stone-500">{module.description}</p>
              <span className="mt-5 inline-flex font-black text-amber-700 transition group-hover:translate-x-1">
                Open →
              </span>
            </button>
          ))}
        </div>

        <section className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-black/5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-stone-400">Roadmap</p>
              <h2 className="mt-1 text-2xl font-black">Next commercial modules</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-stone-500">
              These are intentionally visible as the SaaS grows, but not clickable until the operating flow is complete.
            </p>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-4">
            {roadmapModules.map((module) => (
              <div key={module} className="rounded-2xl bg-stone-50 p-4 font-black text-stone-400">
                {module}
                <p className="mt-1 text-xs font-bold uppercase tracking-wide">Coming soon</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}