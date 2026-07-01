import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Header from "../components/Header";
import MenuCard from "../components/MenuCard";

import { useCart } from "../context/CartContext";
import { getMenu } from "../services/menuService";

export default function Menu() {
  const [menuItems, setMenuItems] = useState([]);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const table = searchParams.get("table");
  const mobile = searchParams.get("mobile");

  const { total, totalItems } = useCart();

  useEffect(() => {
    async function loadMenu() {
      const items = await getMenu();
      setMenuItems(items);
    }

    loadMenu();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-[430px] bg-white min-h-screen shadow-xl">

        <Header
          title="☕ Caffein Cafe"
          subtitle={`Table ${table}`}
        />

        <div className="sticky top-[72px] bg-white border-b p-4 z-40">

          <input
            placeholder="🔍 Search menu..."
            className="w-full rounded-xl border border-gray-300 p-3"
          />

        </div>

        <div className="p-4 pb-28">

          {menuItems.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
            />
          ))}

        </div>

        {totalItems > 0 && (

          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t p-4 shadow-xl">

            <button
              onClick={() =>
                navigate(
                  `/cart?table=${table}&mobile=${mobile}`
                )
              }
              className="w-full rounded-xl bg-green-700 text-white py-4 font-bold text-lg"
            >
              🛒 {totalItems} item{totalItems > 1 ? "s" : ""} • ₹{total}
            </button>

          </div>

        )}

      </div>
    </div>
  );
} 