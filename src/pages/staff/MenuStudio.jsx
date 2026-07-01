import { useEffect, useMemo, useState } from "react";

import MenuEditorModal from "../../components/staff/MenuEditorModal";
import MenuImportModal from "../../components/staff/MenuImportModal";
import MenuProductCard from "../../components/staff/MenuProductCard";
import {
  deleteMenuImage,
  uploadMenuImage,
} from "../../services/imageService";
import {
  addMenuItem,
  getMenu,
  importMenuItems,
  updateMenuItem,
} from "../../services/menuService";

const FILTERS = [
  ["active", "Active"],
  ["all", "All"],
  ["archived", "Archived"],
  ["unavailable", "Unavailable"],
];

export default function MenuStudio() {
  const [menuItems, setMenuItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("active");
  const [expanded, setExpanded] = useState({});
  const [openEditor, setOpenEditor] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    loadMenu();
  }, []);

  async function loadMenu() {
    setIsLoading(true);
    setError("");

    try {
      const items = await getMenu({ includeArchived: true });
      setMenuItems(items);
      setExpanded((current) => {
        const next = { ...current };
        items.forEach((item) => {
          if (item.Category && next[item.Category] === undefined) {
            next[item.Category] = true;
          }
        });
        return next;
      });
    } catch (loadError) {
      console.error(loadError);
      setError("The menu could not be loaded. Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const counts = useMemo(
    () => ({
      all: menuItems.length,
      active: menuItems.filter((item) => !item.Archived).length,
      archived: menuItems.filter((item) => item.Archived).length,
      unavailable: menuItems.filter((item) => !item.Archived && !item.Available).length,
    }),
    [menuItems],
  );

  const categories = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const grouped = {};

    menuItems
      .filter((item) => {
        if (filter === "active" && item.Archived) return false;
        if (filter === "archived" && !item.Archived) return false;
        if (filter === "unavailable" && (item.Archived || item.Available)) return false;

        if (!normalizedSearch) return true;
        return [item.Name, item.Category, item.Description]
          .some((value) => String(value || "").toLowerCase().includes(normalizedSearch));
      })
      .forEach((item) => {
        const category = item.Category || "Uncategorized";
        if (!grouped[category]) grouped[category] = [];
        grouped[category].push(item);
      });

    return Object.entries(grouped).sort(([first], [second]) => first.localeCompare(second));
  }, [filter, menuItems, search]);

  async function handleSave(item, imageChanges, onUploadProgress) {
    const previousImage = item.Image || "";
    let uploadedImage = "";

    try {
      if (imageChanges.imageFile) {
        uploadedImage = await uploadMenuImage(imageChanges.imageFile, onUploadProgress);
      }

      const payload = {
        ...item,
        Image: imageChanges.removeImage ? "" : uploadedImage || previousImage,
      };

      if (payload.id) {
        const { id, ...data } = payload;
        await updateMenuItem(id, data);
      } else {
        await addMenuItem(payload);
      }

      if ((uploadedImage || imageChanges.removeImage) && previousImage) {
        deleteMenuImage(previousImage).catch((cleanupError) => {
          console.warn("The previous product image could not be removed.", cleanupError);
        });
      }

      setOpenEditor(false);
      setSelectedItem(null);
      setNotice(`“${payload.Name}” was saved.`);
      await loadMenu();
    } catch (saveError) {
      if (uploadedImage) {
        deleteMenuImage(uploadedImage).catch(() => undefined);
      }
      console.error(saveError);
      throw new Error(saveError.message || "Unable to save this product.");
    }
  }

  async function handleImport(items) {
    try {
      const imported = await importMenuItems(items);
      setNotice(`${imported} products were imported successfully.`);
      await loadMenu();
    } catch (importError) {
      console.error(importError);
      throw new Error(importError.message || "Unable to import this menu.");
    }
  }

  function handleAdd(category = "") {
    setSelectedItem({
      Name: "",
      Description: "",
      Price: "",
      Category: category,
      Image: "",
      Available: true,
      BestSeller: false,
      TodaysSpecial: false,
      Archived: false,
    });
    setOpenEditor(true);
  }

  function handleEdit(item) {
    setSelectedItem(item);
    setOpenEditor(true);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h1 className="text-3xl font-bold sm:text-4xl">🍽 Menu Studio</h1>
            <p className="mt-1 text-gray-500">Manage products, pricing, images, and availability.</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setOpenImport(true)}
              className="rounded-xl border border-gray-300 px-4 py-3 font-bold text-gray-700 hover:border-green-700 hover:text-green-700"
            >
              Import Menu
            </button>
            <button
              type="button"
              onClick={() => handleAdd()}
              className="rounded-xl bg-green-700 px-4 py-3 font-bold text-white hover:bg-green-800"
            >
              + Add Product
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-5 sm:p-6">
        {notice && (
          <div className="mb-5 flex items-center justify-between rounded-2xl bg-green-50 p-4 text-sm font-semibold text-green-800">
            <span>{notice}</span>
            <button type="button" onClick={() => setNotice("")} aria-label="Dismiss message">×</button>
          </div>
        )}

        {error && (
          <div className="mb-5 flex items-center justify-between gap-4 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">
            <span>{error}</span>
            <button type="button" onClick={loadMenu} className="rounded-lg bg-white px-3 py-2">Try again</button>
          </div>
        )}

        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products, categories, or descriptions…"
              className="w-full rounded-2xl border border-gray-300 p-4 focus:border-green-700 focus:outline-none"
            />
            <div className="flex flex-wrap gap-2">
              {FILTERS.map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilter(value)}
                  className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
                    filter === value
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {label} {counts[value]}
                </button>
              ))}
            </div>
          </div>
        </section>

        {isLoading ? (
          <div className="py-20 text-center text-gray-500">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-green-700" />
            Loading menu…
          </div>
        ) : categories.length === 0 ? (
          <div className="mt-6 rounded-3xl bg-white p-12 text-center shadow-sm">
            <div className="text-5xl">🔎</div>
            <h2 className="mt-4 text-xl font-bold">No products found</h2>
            <p className="mt-2 text-gray-500">Adjust the search or filter, or add a new product.</p>
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            {categories.map(([category, items]) => (
              <section key={category} className="overflow-hidden rounded-3xl bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => setExpanded((current) => ({
                    ...current,
                    [category]: !current[category],
                  }))}
                  className="flex w-full items-center justify-between p-5 text-left sm:p-6"
                >
                  <div>
                    <h2 className="text-xl font-bold sm:text-2xl">{category}</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {items.length} {items.length === 1 ? "product" : "products"}
                    </p>
                  </div>
                  <span className="text-3xl font-light">{expanded[category] ? "−" : "+"}</span>
                </button>

                {expanded[category] && (
                  <div className="border-t border-gray-100">
                    {items.map((item) => (
                      <MenuProductCard key={item.id} item={item} onEdit={handleEdit} />
                    ))}
                    {filter !== "archived" && (
                      <button
                        type="button"
                        onClick={() => handleAdd(category)}
                        className="w-full py-4 font-bold text-green-700 hover:bg-green-50"
                      >
                        + Add product to {category}
                      </button>
                    )}
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
      </main>

      <MenuEditorModal
        open={openEditor}
        item={selectedItem}
        menuItems={menuItems}
        onClose={() => {
          setOpenEditor(false);
          setSelectedItem(null);
        }}
        onSave={handleSave}
      />

      <MenuImportModal
        open={openImport}
        onClose={() => setOpenImport(false)}
        onImport={handleImport}
      />
    </div>
  );
}