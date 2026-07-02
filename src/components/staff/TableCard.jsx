import { useNavigate } from "react-router-dom";
import { closeTable } from "../../services/orderService";

export default function TableCard({ table }) {
  const navigate = useNavigate();

  async function handleClose() {
    if (!window.confirm(`Close Table ${table.id}?\n\nThe customer won't be able to add more items. You can reopen it later from the order screen.`)) {
      return;
    }

    try {
      await closeTable(table.id);
      alert("Table closed successfully.");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  const isOpen = table.status === "OPEN";

  return (
    <article className="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-xl">
      <div className="bg-stone-950 p-5 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">Active table</p>
            <h2 className="mt-1 text-4xl font-black">{table.id}</h2>
          </div>

          <span className={`rounded-full px-3 py-1 text-xs font-black ${isOpen ? "bg-emerald-300 text-emerald-950" : "bg-white/10 text-stone-300"}`}>
            {isOpen ? "OPEN" : "CLOSED"}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="rounded-3xl bg-stone-50 p-4">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-stone-400">Guest mobile</p>
          <p className="mt-1 text-lg font-black">{table.mobile || "Waiting"}</p>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-stone-400">Current bill</p>
            <h3 className="mt-1 text-4xl font-black">₹{table.total || 0}</h3>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate(`/order/${table.id}`)}
            className="rounded-2xl bg-stone-950 py-3 font-black text-white transition hover:bg-stone-800"
          >
            View Order
          </button>

          <button
            onClick={handleClose}
            disabled={!isOpen}
            className={`rounded-2xl py-3 font-black transition ${
              isOpen ? "bg-amber-400 text-stone-950 hover:bg-amber-300" : "bg-stone-100 text-stone-400 cursor-not-allowed"
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </article>
  );
}