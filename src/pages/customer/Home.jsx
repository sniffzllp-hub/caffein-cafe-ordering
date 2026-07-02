import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";

import BrandLogo from "../../components/BrandLogo";
import { db } from "../../services/firebase";
import { resolveTableAccess } from "../../services/tableService";

export default function Home() {
  const [searchParams] = useSearchParams();
  const { tableToken } = useParams();
  const navigate = useNavigate();

  const legacyTable = searchParams.get("table") || "1";

  const [table, setTable] = useState(null);
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingTable, setCheckingTable] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTable() {
      try {
        const resolved = await resolveTableAccess({
          token: tableToken,
          tableId: tableToken ? null : legacyTable,
        });
        setTable(resolved);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setCheckingTable(false);
      }
    }

    loadTable();
  }, [legacyTable, tableToken]);

  async function handleContinue() {
    if (!table) return;

    if (mobile.length !== 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);

    try {
      const tableRef = doc(db, "Tables", table.id);

      if (table.status === "OPEN") {
        if (table.mobile === mobile) {
          navigate(`/menu?tableKey=${table.token}&mobile=${mobile}`);
        } else {
          alert("This table already has an active order. Please contact the staff.");
        }

        setLoading(false);
        return;
      }

      await setDoc(
        tableRef,
        {
          status: "OPEN",
          mobile,
          total: table.total || 0,
          token: table.token,
          tableNumber: Number(table.id),
        },
        { merge: true }
      );

      navigate(`/menu?tableKey=${table.token}&mobile=${mobile}`);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please ask our team for help.");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#120d09] text-white flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.28),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(87,38,12,0.55),transparent_40%)]" />

      <div className="relative w-full max-w-md overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/10 shadow-2xl backdrop-blur-xl">
        <div className="p-8">
          <div className="flex items-center justify-between">
            <BrandLogo size="lg" />
            <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-amber-100">
              QR Ordering
            </span>
          </div>

          <div className="mt-8">
            <BrandLogo showName nameClassName="text-sm font-black uppercase tracking-[0.32em] text-amber-200" className="gap-0" />
            <h1 className="mt-3 text-5xl font-black leading-tight tracking-tight">Order from your table</h1>
            <p className="mt-4 text-sm leading-6 text-stone-300">
              Browse the menu, add your favourites, and send your order straight to the counter.
            </p>
          </div>

          <div className="mt-7 rounded-3xl border border-white/10 bg-black/20 p-5">
            {checkingTable ? (
              <p className="text-stone-300">Checking your table...</p>
            ) : error ? (
              <p className="text-sm font-semibold text-red-300">{error}</p>
            ) : (
              <>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-stone-400">You are seated at</p>
                <div className="mt-2 text-4xl font-black text-amber-200">Table {table.id}</div>
              </>
            )}
          </div>

          <div className="mt-6">
            <label className="text-sm font-bold text-stone-200" htmlFor="mobile">
              Mobile number
            </label>
            <input
              id="mobile"
              type="tel"
              inputMode="numeric"
              placeholder="10-digit mobile number"
              value={mobile}
              onChange={(event) => setMobile(event.target.value.replace(/\D/g, "").slice(0, 10))}
              className="mt-3 w-full rounded-2xl border border-white/10 bg-white px-5 py-4 text-lg font-bold text-stone-950 outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-300/20"
            />
          </div>

          <button
            onClick={handleContinue}
            disabled={loading || checkingTable || !!error}
            className="mt-5 w-full rounded-2xl bg-amber-400 py-4 font-black text-stone-950 shadow-lg shadow-amber-950/30 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Opening menu..." : "Continue to Menu"}
          </button>
        </div>
      </div>
    </div>
  );
}