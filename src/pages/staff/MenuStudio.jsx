import { useEffect, useMemo, useState } from "react";

import {
  getMenu,
  updateMenuItem,
  addMenuItem,
} from "../../services/menuService";

import MenuEditorModal from "../../components/staff/MenuEditorModal";

export default function MenuStudio() {
  const [menuItems, setMenuItems] = useState([]);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState({});

  const [openEditor, setOpenEditor] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    loadMenu();
  }, []);

  async function loadMenu() {
    const items = await getMenu();

    setMenuItems(items);

    const open = {};

    items.forEach((item) => {
      if (item.Category) {
        open[item.Category] = true;
      }
    });

    setExpanded(open);
  }

  const categories = useMemo(() => {
    const grouped = {};

    menuItems.forEach((item) => {
      const category = item.Category || "Uncategorized";

      if (!grouped[category]) {
        grouped[category] = [];
      }

      grouped[category].push(item);
    });

    return Object.entries(grouped).filter(([category]) =>
      category.toLowerCase().includes(search.toLowerCase())
    );
  }, [menuItems, search]);

  async function handleSave(item) {
    try {
      if (item.id) {
        const { id, ...data } = item;
        await updateMenuItem(id, data);
      } else {
        await addMenuItem(item);
      }

      setOpenEditor(false);
      setSelectedItem(null);

      await loadMenu();

    } catch (err) {
      console.error(err);
      alert("Unable to save item.");
    }
  }

  function handleAdd(category) {
    setSelectedItem({
      Name: "",
      Description: "",
      Price: "",
      Category: category,
      Available: true,
    });

    setOpenEditor(true);
  }

  function handleEdit(item) {
    setSelectedItem(item);
    setOpenEditor(true);
  }

  return (    <div className="min-h-screen bg-gray-100">

      <div className="bg-white shadow sticky top-0 z-50">

        <div className="max-w-5xl mx-auto p-6">

          <h1 className="text-4xl font-bold">
            🍽 Menu Studio
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your restaurant menu
          </p>

        </div>

      </div>

      <div className="max-w-5xl mx-auto p-6">

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search Categories..."
          className="w-full rounded-2xl border p-4 mb-6"
        />

        <div className="space-y-5">

          {categories.map(([category, items]) => (

            <div
              key={category}
              className="bg-white rounded-3xl shadow overflow-hidden"
            >

              <button
                onClick={() =>
                  setExpanded((prev) => ({
                    ...prev,
                    [category]: !prev[category],
                  }))
                }
                className="w-full flex justify-between items-center p-6"
              >

                <div>

                  <h2 className="text-2xl font-bold">
                    {category}
                  </h2>

                  <p className="text-gray-500">
                    {items.length} Items
                  </p>

                </div>

                <div className="text-3xl font-light">
                  {expanded[category] ? "−" : "+"}
                </div>

              </button>

              {expanded[category] && (

                <div className="border-t">

                  {items.map((item) => (

                    <div
                      key={item.id}
                      className="flex justify-between items-center p-4 border-b hover:bg-gray-50"
                    >

                      <div>

                        <div className="font-semibold text-lg">
                          {item.Name}
                        </div>

                        <div className="text-gray-500">
                          ₹{item.Price}
                        </div>

                      </div>

                      <button
                        onClick={() => handleEdit(item)}
                        className="rounded-xl bg-blue-600 text-white px-4 py-2"
                      >
                        Edit
                      </button>

                    </div>

                  ))}

                  <button
                    onClick={() => handleAdd(category)}
                    className="w-full py-4 font-bold text-green-700 hover:bg-green-50"
                  >
                    + Add Product
                  </button>

                </div>

              )}

            </div>

          ))}

        </div>

        <button
          className="mt-8 w-full rounded-2xl bg-green-700 text-white py-4 font-bold text-lg"
        >
          + Add Category
        </button>

      </div>

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

    </div>
  );
}