import { useMemo, useState } from "react";

const ACCESS_PIN = "1228";

function sessionKeyForArea(area) {
  return `caffein_${area}_access`;
}

export default function StaffAuthGate({ children, area = "staff" }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const sessionKey = sessionKeyForArea(area);
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(sessionKey) === ACCESS_PIN
  );

  const title = useMemo(
    () => (area === "admin" ? "Admin Portal" : "Staff Dashboard"),
    [area]
  );

  function handleSubmit(event) {
    event.preventDefault();

    if (pin === ACCESS_PIN) {
      sessionStorage.setItem(sessionKey, ACCESS_PIN);
      setUnlocked(true);
      return;
    }

    setError("Incorrect PIN. Please try again.");
  }

  if (unlocked) {
    return children;
  }

  return (
    <div className="min-h-screen bg-[#120d09] text-white flex items-center justify-center p-5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.22),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(120,53,15,0.32),transparent_38%)] pointer-events-none" />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md rounded-[2rem] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl"
      >
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-200">
            Caffein Cafe
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-stone-300">
            Protected workspace for restaurant operations. Enter the café PIN to continue.
          </p>
        </div>

        <label className="text-sm font-semibold text-stone-200" htmlFor={`${area}-pin`}>
          Access PIN
        </label>
        <input
          id={`${area}-pin`}
          type="password"
          inputMode="numeric"
          value={pin}
          onChange={(event) => {
            setPin(event.target.value.replace(/\D/g, "").slice(0, 4));
            setError("");
          }}
          placeholder="1228"
          className="mt-3 w-full rounded-2xl border border-white/15 bg-black/25 px-5 py-4 text-center text-3xl font-black tracking-[0.45em] text-white outline-none transition focus:border-amber-300"
        />

        {error && <p className="mt-3 text-sm font-semibold text-red-300">{error}</p>}

        <button
          type="submit"
          className="mt-6 w-full rounded-2xl bg-amber-400 py-4 font-black text-stone-950 shadow-lg shadow-amber-950/30 transition hover:bg-amber-300"
        >
          Unlock {title}
        </button>

        <p className="mt-5 rounded-2xl bg-white/8 p-4 text-xs leading-5 text-stone-300">
          This PIN protects the demo screens from guests. For production staff accounts, this should later become Firebase Auth with roles.
        </p>
      </form>
    </div>
  );
}