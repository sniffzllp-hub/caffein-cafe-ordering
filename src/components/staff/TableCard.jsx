import { useNavigate } from "react-router-dom";
import { closeTable } from "../../services/orderService";

export default function TableCard({ table }) {
  const navigate = useNavigate();

  async function handleClose() {
    if (
      !window.confirm(
        `Close Table ${table.id}?\n\nThe customer won't be able to add more items.\n\nYou can reopen it later.`
      )
    ) {
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
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition">

      <div className="flex justify-between items-start">

        <div>

          <h2 className="text-2xl font-bold">
            Table {table.id}
          </h2>

          <p className="text-gray-500 mt-2">
            👤 {table.mobile || "Waiting for customer"}
          </p>

        </div>

        <div
          className={`px-4 py-2 rounded-full text-sm font-bold ${
            isOpen
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {isOpen ? "🟢 OPEN" : "⚫ CLOSED"}
        </div>

      </div>

      <div className="mt-8">

        <p className="text-gray-400 uppercase tracking-wide text-xs">
          Current Bill
        </p>

        <h3 className="text-4xl font-bold mt-2">
          ₹{table.total || 0}
        </h3>

      </div>

      <div className="grid grid-cols-2 gap-3 mt-8">

        <button
          onClick={() => navigate(`/order/${table.id}`)}
          className="rounded-2xl bg-blue-600 hover:bg-blue-700 text-white py-3 font-semibold transition"
        >
          View Order
        </button>

        <button
          onClick={handleClose}
          disabled={!isOpen}
          className={`rounded-2xl py-3 font-semibold transition ${
            isOpen
              ? "bg-green-700 hover:bg-green-800 text-white"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          Close Table
        </button>

      </div>

    </div>
  );
}