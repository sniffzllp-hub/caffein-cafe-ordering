import { useCart } from "../../context/CartContext";

export default function MenuCard({ item }) {
  const { cart, addToCart, increaseQty, decreaseQty } = useCart();
  const cartItem = cart.find((i) => i.id === item.id);
  const qty = cartItem ? cartItem.qty : 0;

  return (
    <article className="mb-4 overflow-hidden rounded-[1.5rem] bg-white shadow-sm ring-1 ring-black/5">
      <div className="flex gap-4 p-4">
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-amber-100 to-stone-100">
          {item.Image ? (
            <img src={item.Image} alt={item.Name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl">☕</div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            {item.BestSeller && (
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-amber-800">
                Best Seller
              </span>
            )}
            {item.TodaysSpecial && (
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-emerald-800">
                Special
              </span>
            )}
          </div>

          <h3 className="mt-2 text-lg font-black leading-tight text-stone-950">{item.Name}</h3>
          {item.Description && <p className="mt-1 line-clamp-2 text-sm leading-5 text-stone-500">{item.Description}</p>}

          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="text-2xl font-black text-stone-950">₹{item.Price}</span>

            {qty === 0 ? (
              <button
                onClick={() => addToCart(item)}
                className="rounded-2xl bg-amber-400 px-5 py-2.5 text-sm font-black text-stone-950 shadow-sm transition hover:bg-amber-300"
              >
                Add
              </button>
            ) : (
              <div className="flex items-center gap-2 rounded-2xl bg-stone-950 p-1 text-white">
                <button onClick={() => decreaseQty(item.id)} className="h-9 w-9 rounded-xl bg-white/10 text-xl font-black">
                  −
                </button>
                <span className="w-7 text-center font-black">{qty}</span>
                <button onClick={() => increaseQty(item.id)} className="h-9 w-9 rounded-xl bg-amber-400 text-xl font-black text-stone-950">
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}