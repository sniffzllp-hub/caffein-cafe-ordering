import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const tableKey = searchParams.get("tableKey");
  const mobile = searchParams.get("mobile");
  const [countdown, setCountdown] = useState(3);

  const menuPath = `/menu?tableKey=${tableKey}&mobile=${mobile}`;

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          navigate(menuPath);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [menuPath, navigate]);

  return (
    <div className="min-h-screen bg-[#120d09] text-white flex items-center justify-center p-5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.24),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.28),transparent_40%)]" />

      <div className="relative w-full max-w-md rounded-[2.25rem] border border-white/10 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-300 text-6xl shadow-lg shadow-emerald-950/30">
          ✓
        </div>

        <p className="mt-8 text-sm font-black uppercase tracking-[0.28em] text-amber-200">Order received</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">Sent to the team</h1>
        <p className="mt-4 text-sm leading-6 text-stone-300">
          We have your order. You can keep browsing and add more items until staff closes your table.
        </p>

        <div className="mt-8 rounded-3xl bg-black/20 p-5">
          <p className="text-sm text-stone-300">Taking you back to the menu in</p>
          <div className="mt-1 text-5xl font-black text-amber-200">{countdown}</div>
        </div>

        <button
          onClick={() => navigate(menuPath)}
          className="mt-6 w-full rounded-2xl bg-amber-400 py-4 font-black text-stone-950 shadow-lg shadow-amber-950/30 transition hover:bg-amber-300"
        >
          Continue Browsing
        </button>
      </div>
    </div>
  );
}