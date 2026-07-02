import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import MenuCard from "../../components/customer/MenuCard";
import { useCart } from "../../context/CartContext";
import { getMenu } from "../../services/menuService";
import { resolveTableAccess } from "../../services/tableService";

export default function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [search, setSearch] = useState("");
  const [openCategories, setOpenCategories] = useState({});
  const [table, setTable] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const tableKey = searchParams.get("tableKey");
  const legacyTable = searchParams.get("table");
  const mobile = searchParams.get("mobile");

  const { total, totalItems } = useCart();

  useEffect(() => {
    async function loadPage() {
      try {
        const [items, resolvedTable] = await Promise.all([
          getMenu(),
          resolveTableAccess({ token: tableKey, tableId: legacyTable }),
        ]);

        setMenuItems(items);
        setTable(resolvedTable);

        const expanded = {};
        items.forEach((item) => {
          expanded[item.Category] = true;
        });
        setOpenCategories(expanded);
      } catch (err) {
        console.error(err);
        alert(err.message || "Could not open menu.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    }

    loadPage();
  }, [legacyTable, navigate, tableKey]);

  const filteredItems = useMemo(() => {
    const value = search.trim().toLowerCase();

    return menuItems.filter((item) => {
      if (!value) return true;

      return [item.Name, item.Category, item.Description]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(value));
    });
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

  const featuredItems = useMemo(
    () => menuItems.filter((item) => item.BestSeller || item.TodaysSpecial).slice(0, 4),
    [menuItems]
  );

  function toggleCategory(category) {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  }

  if (loading) {
    return <div className="min-h-screen bg-[#f5efe6] p-8 text-stone-700">Preparing your menu...</div>;
  }

  return (
    <div className="min-h-screen bg-[#eee4d6] flex justify-center text-stone-950">
      <div className="w-full max-w-[460px] min-h-screen bg-[#fbf7ef] shadow-2xl">
        <header className="sticky top-0 z-50 overflow-hidden bg-stone-950 text-white shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.32),transparent_35%)]" />
          <div className="relative p-5 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-300">Caffein Cafe</p>
                <h1 className="mt-1 text-3xl font-black tracking-tight">Menu</h1>
              </div>
              <div className="rounded-2xl bg-white/10 px-4 py-3 text-right">
                <p className="text-xs text-stone-300">Table</p>
                <p className="text-xl font-black text-amber-200">{table?.id}</p>
              </div>
            </div>

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search coffee, snacks, desserts..."
              className="mt-5 w-full rounded-2xl border border-white/10 bg-white px-4 py-3 font-semibold text-stone-950 outline-none focus:ring-4 focus:ring-amber-300/30"
            />
          </div>
        </header>

        <main className="p-4 pb-32">
          {featuredItems.length > 0 && !search && (
            <section className="mb-6">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xl font-black">Chef picks</h2>
                <span className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">Today</span>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {featuredItems.map((item) => (
                  <div key={item.id} className="min-w-48 rounded-3xl bg-stone-950 p-4 text-white shadow-lg">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">
                      {item.TodaysSpecial ? "Today's Special" : "Best Seller"}
                    </p>
                    <h3 className="mt-3 line-clamp-2 text-lg font-black">{item.Name}</h3>
                    <p className="mt-2 text-2xl font-black text-amber-200">₹{item.Price}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {Object.entries(grouped).map(([category, items]) => (
            <section key={category} className="mb-6">
              <button
                onClick={() => toggleCategory(category)}
                className="mb-3 flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-black/5"
              >
                <div className="text-left">
                  <h2 className="text-xl font-black">{category}</h2>
                  <p className="text-xs font-semibold text-stone-500">{items.length} item{items.length > 1 ? "s" : ""}</p>
                </div>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-xl font-black text-amber-900">
                  {openCategories[category] ? "−" : "+"}
                </span>
              </button>

              {openCategories[category] && items.map((item) => <MenuCard key={item.id} item={item} />)}
            </section>
          ))}
        </main>

        {totalItems > 0 && (
          <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-[460px] -translate-x-1/2 border-t border-stone-200 bg-white/95 p-4 shadow-2xl backdrop-blur-xl">
            <button
              onClick={() => navigate(`/cart?tableKey=${table.token}&mobile=${mobile}`)}
              className="flex w-full items-center justify-between rounded-2xl bg-stone-950 px-5 py-4 font-black text-white shadow-lg shadow-stone-950/20"
            >
              <span>{totalItems} item{totalItems > 1 ? "s" : ""}</span>
              <span>View Cart • ₹{total}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}