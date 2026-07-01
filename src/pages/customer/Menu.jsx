import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Header from "../../components/customer/Header";
import MenuCard from "../../components/customer/MenuCard";

import { useCart } from "../../context/CartContext";
import { getMenu } from "../../services/menuService";

export default function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [search, setSearch] = useState("");
  const [openCategories, setOpenCategories] = useState({});

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const table = searchParams.get("table");
  const mobile = searchParams.get("mobile");

  const { total, totalItems } = useCart();

  useEffect(() => {
    async function loadMenu() {
      const items = await getMenu();

      setMenuItems(items);

      const expanded = {};

      items.forEach((item) => {
        expanded[item.Category] = true;
      });

      setOpenCategories(expanded);
    }

    loadMenu();
  }, []);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) =>
      item.Name.toLowerCase().includes(search.toLowerCase())
    );
  }, [menuItems, search]);

  const grouped = useMemo(() => {
    const groups = {};

    filteredItems.forEach((item) => {
      if (!groups[item.Category]) {
        groups[item.Category] = [];
      }

      groups[item.Category].push(item);
    });

    return groups;
  }, [filteredItems]);

  function toggleCategory(category) {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-[430px] bg-white min-h-screen shadow-xl">

        <Header
          title="☕ Caffein Cafe"
          subtitle={`Table ${table}`}
        />

        <div className="sticky top-[72px] bg-white border-b p-4 z-40">

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search menu..."
            className="w-full rounded-xl border border-gray-300 p-3"
          />

        </div>

        <div className="p-4 pb-28">

          {Object.entries(grouped).map(([category, items]) => (

            <div key={category} className="mb-6">

              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex justify-between items-center mb-3"
              >

                <h2 className="text-xl font-bold">
                  {category}
                </h2>

                <span className="text-xl">
                  {openCategories[category] ? "−" : "+"}
                </span>

              </button>

              {openCategories[category] &&
                items.map((item) => (
                  <MenuCard
                    key={item.id}
                    item={item}
                  />
                ))}

            </div>

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