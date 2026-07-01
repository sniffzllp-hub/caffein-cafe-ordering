import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";

import { db } from "../services/firebase";
import TableCard from "../components/TableCard";

export default function Dashboard() {
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

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="sticky top-0 bg-white shadow p-5 z-50">

        <h1 className="text-3xl font-bold">
          ☕ Caffein Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          Live Tables
        </p>

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