import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import { useCart } from "../context/CartContext";
import { placeOrder } from "../services/orderService";

export default function Cart() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const table = searchParams.get("table");
  const mobile = searchParams.get("mobile");

  const {
    cart,
    total,
    increaseQty,
    decreaseQty,
  } = useCart();

  async function handlePlaceOrder() {
    try {
      await placeOrder(
        table,
        mobile,
        cart,
        total
      );

      navigate("/success");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-[430px] min-h-screen bg-white shadow-xl flex flex-col">

        <Header
          title="Your Cart"
          subtitle={`Table ${table}`}
          showBack={true}
          onBack={() => navigate(-1)}
        />

        <div className="flex-1 p-4 pb-36">

          {cart.map((item) => (

            <div
              key={item.id}
              className="rounded-2xl border border-gray-200 p-4 mb-4 shadow-sm"
            >

              <div className="flex justify-between">

                <div>

                  <h2 className="font-bold text-lg">
                    {item.Name}
                  </h2>

                  <p className="text-gray-500">
                    ₹{item.Price} each
                  </p>

                </div>

                <h2 className="font-bold">
                  ₹{item.Price * item.qty}
                </h2>

              </div>

              <div className="flex justify-end gap-3 mt-4">

                <button
                  onClick={() => decreaseQty(item.id)}
                  className="w-10 h-10 rounded-full bg-red-500 text-white"
                >
                  −
                </button>

                <div className="w-8 text-center font-bold text-lg">
                  {item.qty}
                </div>

                <button
                  onClick={() => increaseQty(item.id)}
                  className="w-10 h-10 rounded-full bg-green-600 text-white"
                >
                  +
                </button>

              </div>

            </div>

          ))}

        </div>

        <div className="sticky bottom-0 bg-white border-t p-4">

          <div className="flex justify-between mb-4">

            <span className="font-bold">
              Total
            </span>

            <span className="font-bold text-2xl">
              ₹{total}
            </span>

          </div>

          <button
            onClick={handlePlaceOrder}
            className="w-full bg-green-700 text-white rounded-xl py-4 font-bold"
          >
            Place Order
          </button>

        </div>

      </div>

    </div>
  );
}