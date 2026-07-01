import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const table = searchParams.get("table");
  const mobile = searchParams.get("mobile");

  const { clearCart } = useCart();

  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    clearCart();

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);

          navigate(
            `/menu?table=${table}&mobile=${mobile}`
          );

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);

  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">

      <div className="w-full max-w-[430px] bg-white rounded-3xl shadow-xl p-8 text-center">

        <div className="text-7xl mb-4">
          ✅
        </div>

        <h1 className="text-3xl font-bold">
          Order Received!
        </h1>

        <p className="text-gray-500 mt-4">
          We've sent your order to the kitchen.
        </p>

        <p className="text-gray-500">
          You can continue browsing and add more items anytime before your table is closed.
        </p>

        <div className="mt-8 text-lg font-semibold">

          Redirecting in {countdown}...

        </div>

        <button
          onClick={() =>
            navigate(
              `/menu?table=${table}&mobile=${mobile}`
            )
          }
          className="mt-8 w-full bg-green-700 text-white rounded-xl py-4 font-bold"
        >
          Continue Browsing
        </button>

      </div>

    </div>
  );
}