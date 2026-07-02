import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useCart } from "../../context/CartContext";
import { placeOrder } from "../../services/orderService";
import { resolveTableAccess } from "../../services/tableService";

export default function Cart() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const tableKey = searchParams.get("tableKey");
  const legacyTable = searchParams.get("table");
  const mobile = searchParams.get("mobile");

  const [table, setTable] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [loading, setLoading] = useState(true);

  const { cart, total, increaseQty, decreaseQty, clearCart } = useCart();

  useEffect(() => {
    async function loadTable() {
      try {
        setTable(await resolveTableAccess({ token: tableKey, tableId: legacyTable }));
      } catch (err) {
        console.error(err);
        alert(err.message || "Could not open cart.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    }

    loadTable();
  }, [legacyTable, navigate, tableKey]);

  async function handlePlaceOrder() {
    if (placingOrder || !table) return;

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setPlacingOrder(true);

    try {
      await placeOrder(table.id, mobile, cart, total);
      clearCart();
      navigate(`/success?tableKey=${table.token}&mobile=${mobile}`);
    } catch (err) {
      console.error(err);
      alert(err.message);
      setPlacingOrder(false);
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-[#f5efe6] p-8 text-stone-700">Loading cart...</div>;
  }

  return (
    <div className="min-h-screen bg-[#eee4d6] flex justify-center text-stone-950">
      <div className="w-full max-w-[460px] min-h-screen bg-[#fbf7ef] shadow-2xl flex flex-col">
        <header className="sticky top-0 z-50 bg-stone-950 p-5 text-white shadow-xl">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-2xl">
              ←
            </button>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-300">Table {table?.id}</p>
              <h1 className="text-3xl font-black">Your Cart</h1>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 pb-36">
          {cart.length === 0 ? (
            <div className="mt-8 rounded-[2rem] bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
              <div className="text-6xl">🧺</div>
              <h2 className="mt-4 text-2xl font-black">Your cart is empty</h2>
              <p className="mt-2 text-stone-500">Add something delicious from the menu.</p>
              <button
                onClick={() => navigate(`/menu?tableKey=${table.token}&mobile=${mobile}`)}
                className="mt-6 rounded-2xl bg-amber-400 px-6 py-3 font-black text-stone-950"
              >
                Back to Menu
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <article key={item.id} className="mb-4 rounded-[1.5rem] bg-white p-4 shadow-sm ring-1 ring-black/5">
                <div className="flex justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-black">{item.Name}</h2>
                    <p className="mt-1 text-sm font-semibold text-stone-500">₹{item.Price} each</p>
                  </div>
                  <h3 className="text-xl font-black">₹{item.Price * item.qty}</h3>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <button onClick={() => decreaseQty(item.id)} className="h-10 w-10 rounded-2xl bg-stone-100 text-xl font-black text-stone-900">
                    −
                  </button>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-950 font-black text-white">{item.qty}</div>
                  <button onClick={() => increaseQty(item.id)} className="h-10 w-10 rounded-2xl bg-amber-400 text-xl font-black text-stone-950">
                    +
                  </button>
                </div>
              </article>
            ))
          )}
        </main>

        <footer className="fixed bottom-0 left-1/2 z-50 w-full max-w-[460px] -translate-x-1/2 border-t border-stone-200 bg-white/95 p-4 shadow-2xl backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-black uppercase tracking-[0.18em] text-stone-500">Total</span>
            <span className="text-3xl font-black">₹{total}</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={placingOrder || cart.length === 0}
            className="w-full rounded-2xl bg-stone-950 py-4 font-black text-white shadow-lg shadow-stone-950/20 transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {placingOrder ? "Sending to kitchen..." : "Place Order"}
          </button>
        </footer>
      </div>
    </div>
  );
}