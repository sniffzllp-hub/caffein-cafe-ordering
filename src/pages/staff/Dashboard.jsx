import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";

import { db } from "../../services/firebase";
import TableCard from "../../components/TableCard";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [tables, setTables] = useState([]);
  const navigate = useNavigate();

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

  const closedTables = tables.filter(
    (t) => t.status === "CLOSED"
  );

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="sticky top-0 bg-white shadow p-6 z-50">

        <h1 className="text-3xl font-bold">
          ☕ Caffein Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Live Restaurant Overview
        </p>

        <div className="grid grid-cols-3 gap-4 mt-6">

          <div className="bg-green-50 rounded-2xl p-4">

            <div className="text-gray-500 text-sm">
              Open Tables
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">

  <button
    onClick={() => navigate("/menu-studio")}
    className="rounded-2xl bg-amber-600 text-white p-5 text-left hover:bg-amber-700 transition"
  >
    <div className="text-3xl">🍽️</div>

    <div className="mt-2 font-bold text-lg">
      Menu Studio
    </div>

    <div className="text-sm opacity-90">
      Manage menu items
    </div>
  </button>

  <div
    className="rounded-2xl bg-gray-200 p-5 text-left opacity-70"
  >
    <div className="text-3xl">📊</div>

    <div className="mt-2 font-bold text-lg">
      Analytics
    </div>

    <div className="text-sm">
      Coming Soon
    </div>
  </div>

</div>

            <div className="text-3xl font-bold text-green-700">
              {openTables.length}
            </div>

          </div>

          <div className="bg-red-50 rounded-2xl p-4">

            <div className="text-gray-500 text-sm">
              Closed
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">

  <button
    onClick={() => navigate("/menu-studio")}
    className="rounded-2xl bg-amber-600 text-white p-5 text-left hover:bg-amber-700 transition"
  >
    <div className="text-3xl">🍽️</div>

    <div className="mt-2 font-bold text-lg">
      Menu Studio
    </div>

    <div className="text-sm opacity-90">
      Manage menu items
    </div>
  </button>

  <div
    className="rounded-2xl bg-gray-200 p-5 text-left opacity-70"
  >
    <div className="text-3xl">📊</div>

    <div className="mt-2 font-bold text-lg">
      Analytics
    </div>

    <div className="text-sm">
      Coming Soon
    </div>
  </div>

</div>

            <div className="text-3xl font-bold text-red-600">
              {closedTables.length}
            </div>

          </div>

          <div className="bg-blue-50 rounded-2xl p-4">

            <div className="text-gray-500 text-sm">
              Tables
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">

  <button
    onClick={() => navigate("/menu-studio")}
    className="rounded-2xl bg-amber-600 text-white p-5 text-left hover:bg-amber-700 transition"
  >
    <div className="text-3xl">🍽️</div>

    <div className="mt-2 font-bold text-lg">
      Menu Studio
    </div>

    <div className="text-sm opacity-90">
      Manage menu items
    </div>
  </button>

  <div
    className="rounded-2xl bg-gray-200 p-5 text-left opacity-70"
  >
    <div className="text-3xl">📊</div>

    <div className="mt-2 font-bold text-lg">
      Analytics
    </div>

    <div className="text-sm">
      Coming Soon
    </div>
  </div>

</div>

            <div className="text-3xl font-bold text-blue-600">
              {tables.length}
            </div>

          </div>

        </div>

      </div>

      <div className="max-w-6xl mx-auto p-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

        {tables.map((table) => (
          <TableCard
            key={table.id}
            table={table}
          />
        ))}

      </div>

    </div>
  );
}