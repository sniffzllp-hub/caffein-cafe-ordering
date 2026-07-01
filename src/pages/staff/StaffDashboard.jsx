import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";

import { db } from "../../services/firebase";
import TableCard from "../../components/staff/TableCard";

export default function StaffDashboard() {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "Tables"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        data.sort((a, b) => Number(a.id) - Number(b.id));

        setTables(data);
      }
    );

    return () => unsubscribe();
  }, []);

  const openTables = tables.filter(
    (t) => t.status === "OPEN"
  );

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="sticky top-0 bg-white shadow p-6 z-50">

        <h1 className="text-3xl font-bold">
          ☕ Live Orders
        </h1>

        <p className="text-gray-500 mt-2">
          Cashier Dashboard
        </p>

        <div className="mt-6 bg-green-50 rounded-2xl p-5">

          <div className="text-gray-500 text-sm">
            Open Tables
          </div>

          <div className="text-4xl font-bold text-green-700 mt-2">
            {openTables.length}
          </div>

        </div>

      </div>

      <div className="max-w-6xl mx-auto p-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

        {openTables.map((table) => (
          <TableCard
            key={table.id}
            table={table}
          />
        ))}

      </div>

    </div>
  );
}