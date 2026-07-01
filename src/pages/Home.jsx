import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";

export default function Home() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const table = searchParams.get("table") || "1";

  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    if (mobile.length !== 10) {
      alert("Please enter a valid mobile number.");
      return;
    }

    setLoading(true);

    try {
      const tableRef = doc(db, "Tables", table);
      const tableSnap = await getDoc(tableRef);

      if (!tableSnap.exists()) {
        alert("Invalid table.");
        setLoading(false);
        return;
      }

      const tableData = tableSnap.data();

      // Table already open
      if (tableData.status === "OPEN") {
        if (tableData.mobile === mobile) {
          navigate(`/menu?table=${table}&mobile=${mobile}`);
        } else {
          alert(
            "This table already has an active order. Please contact the staff."
          );
        }

        setLoading(false);
        return;
      }

      // Table is free
      await setDoc(
        tableRef,
        {
          status: "OPEN",
          mobile,
          total: 0,
        },
        { merge: true }
      );

      navigate(`/menu?table=${table}&mobile=${mobile}`);
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">

      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8">

        <div className="text-center">

          <div className="text-6xl">
            ☕
          </div>

          <h1 className="text-3xl font-bold mt-4">
            Caffein Cafe
          </h1>

          <p className="text-gray-500 mt-2">
            Welcome
          </p>

          <div className="inline-block mt-6 bg-gray-100 rounded-full px-6 py-3 font-bold">
            Table {table}
          </div>

        </div>

        <input
          type="tel"
          placeholder="Enter Mobile Number"
          value={mobile}
          onChange={(e) =>
            setMobile(
              e.target.value.replace(/\D/g, "").slice(0, 10)
            )
          }
          className="w-full mt-8 border rounded-xl p-4"
        />

        <button
          onClick={handleContinue}
          disabled={loading}
          className="w-full mt-5 bg-amber-900 text-white rounded-xl py-4 font-bold"
        >
          {loading ? "Checking..." : "Continue"}
        </button>

      </div>

    </div>
  );
}