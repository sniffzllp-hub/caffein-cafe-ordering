import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getMenu,
  updateMenuItem,
  addMenuItem,
} from "../../services/menuService";

import MenuItemCard from "../../components/staff/MenuItemCard";
import MenuEditorModal from "../../components/staff/MenuEditorModal";

export default function CategoryItems() {
  const navigate = useNavigate();
  const { category } = useParams();

  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openEditor, setOpenEditor] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    const menu = await getMenu();

    setItems(
      menu.filter(
        (item) =>
          item.Category === decodeURIComponent(category)
      )
    );
  }

  function handleEdit(item) {
    setSelectedItem(item);
    setOpenEditor(true);
  }

  function handleAdd() {
    setSelectedItem({
      Name: "",
      Description: "",
      Price: "",
      Category: decodeURIComponent(category),
      Available: true,
    });

    setOpenEditor(true);
  }

  async function handleSave(item) {
    try {
      if (item.id) {
        const { id, ...data } = item;
        await updateMenuItem(id, data);
      } else {
        await addMenuItem(item);
      }

      setOpenEditor(false);

      await loadItems();

    } catch (err) {
      console.error(err);
      alert("Unable to save item.");
    }
  }

  function handleDelete(id) {
    console.log(id);
  }

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="bg-white shadow">

        <div className="max-w-5xl mx-auto p-6">

          <button
            onClick={() => navigate(-1)}
            className="mb-5 text-blue-600 font-semibold"
          >
            ← Back
          </button>

          <h1 className="text-4xl font-bold">
            {decodeURIComponent(category)}
          </h1>

        </div>

      </div>

      <div className="max-w-5xl mx-auto p-6 space-y-5">

        {items.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}

        <button
          onClick={handleAdd}
          className="w-full rounded-2xl bg-green-700 text-white py-4 font-bold"
        >
          + Add Item
        </button>

      </div>

      <MenuEditorModal
        open={openEditor}
        item={selectedItem}
        onClose={() => setOpenEditor(false)}
        onSave={handleSave}
      />

    </div>
  );
}