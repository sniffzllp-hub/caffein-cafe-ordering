import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../../components/customer/Header";
import { getCurrentOrder } from "../../services/dashboardService";
import { closeTable } from "../../services/orderService";

export default function ViewOrder() {
  const navigate = useNavigate();
  const { tableId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        const data = await getCurrentOrder(tableId);
        setOrder(data);
      } catch (err) {
        console.error(err);
        alert(err.message);
      }

      setLoading(false);
    }

    loadOrder();
  }, [tableId]);

  async function handleCloseTable() {
    const confirmClose = window.confirm(
      `Close Table ${tableId}?\n\nThe customer will not be able to add more items.`
    );

    if (!confirmClose) return;

    try {
      await closeTable(tableId);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        No active order.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">

      <div className="w-full max-w-[430px] bg-white min-h-screen shadow-xl">

        <Header
          title={`Table ${tableId}`}
          subtitle={order.mobile}
          showBack={true}
          onBack={() => navigate("/dashboard")}
        />

        <div className="p-5">

          <div className="space-y-4">

            {order.items.map((item) => (

              <div
                key={item.id}
                className="flex justify-between"
              >
                <span>
                  {item.qty} × {item.Name}
                </span>

                <span>
                  ₹{item.Price * item.qty}
                </span>
              </div>

            ))}

          </div>

          <hr className="my-6" />

          <div className="flex justify-between text-2xl font-bold">

            <span>Total</span>

            <span>₹{order.total}</span>

          </div>

          <button
            onClick={handleCloseTable}
            className="w-full mt-8 rounded-xl bg-green-700 text-white py-4 font-bold"
          >
            Close Table
          </button>

        </div>

      </div>

    </div>
  );
}