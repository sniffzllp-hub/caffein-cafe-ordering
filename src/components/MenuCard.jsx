import { useCart } from "../context/CartContext";

export default function MenuCard({ item }) {
  const {
    cart,
    addToCart,
    increaseQty,
    decreaseQty,
  } = useCart();

  const cartItem = cart.find((i) => i.id === item.id);

  const qty = cartItem ? cartItem.qty : 0;

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 mb-4 border border-gray-200">

      <h2 className="text-xl font-bold">
        {item.Name}
      </h2>

      <p className="text-gray-500 mt-2">
        {item.Description}
      </p>

      <div className="flex justify-between items-center mt-5">

        <span className="text-2xl font-bold text-green-700">
          ₹{item.Price}
        </span>

        {qty === 0 ? (
          <button
            onClick={() => addToCart(item)}
            className="bg-amber-900 text-white px-5 py-2 rounded-xl font-semibold"
          >
            + Add
          </button>
        ) : (
          <div className="flex items-center gap-3">

            <button
              onClick={() => decreaseQty(item.id)}
              className="w-10 h-10 rounded-full bg-red-500 text-white text-xl"
            >
              −
            </button>

            <span className="text-xl font-bold w-6 text-center">
              {qty}
            </span>

            <button
              onClick={() => increaseQty(item.id)}
              className="w-10 h-10 rounded-full bg-green-600 text-white text-xl"
            >
              +
            </button>

          </div>
        )}

      </div>

    </div>
  );
}