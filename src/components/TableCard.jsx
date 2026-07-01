import { useNavigate } from "react-router-dom";
import { closeTable } from "../services/orderService";

export default function TableCard({ table }) {
  const navigate = useNavigate();

  async function handleClose() {
    if (
      !window.confirm(
        `Close Table ${table.id}?\n\nThis will stop the customer from adding more items.`
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

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 border">

      <div className="flex justify-between items-center">

        <div>
          <h2 className="text-2xl font-bold">
            Table {table.id}
          </h2>

          <p className="text-gray-500 mt-1">
            {table.mobile || "No Customer"}
          </p>
        </div>

        <div
          className={`px-4 py-2 rounded-full text-sm font-bold ${
            table.status === "OPEN"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {table.status}
        </div>

      </div>

      <div className="mt-6">

        <p className="text-gray-500 text-sm">
          Current Bill
        </p>

        <h3 className="text-3xl font-bold">
          ₹{table.total}
        </h3>

      </div>

      <div className="grid grid-cols-2 gap-3 mt-6">

        <button
          onClick={() => navigate(`/order/${table.id}`)}
          className="rounded-xl bg-blue-600 text-white py-3 font-semibold"
        >
          View Order
        </button>

        <button
          onClick={handleClose}
          className="rounded-xl bg-green-700 text-white py-3 font-semibold"
        >
          Close Table
        </button>

      </div>

    </div>
  );
}