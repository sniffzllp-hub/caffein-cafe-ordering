import { useEffect, useMemo, useState } from "react";

export default function MenuEditorModal({
  open,
  item,
  menuItems,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState({});
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    if (item) {
      setForm({
        Available: true,
        BestSeller: false,
        TodaysSpecial: false,
        Archived: false,
        Image: "",
        ...item,
      });

      setNewCategory("");
    }
  }, [item]);

  const categories = useMemo(() => {
  return [
    ...new Set(
      (menuItems || [])
        .map((i) => i.Category)
        .filter(Boolean)
    ),
  ];
}, [menuItems]);

  if (!open) return null;

  function handleCategoryChange(value) {
    if (value === "__new__") {
      setForm({
        ...form,
        Category: "",
      });
      return;
    }

    setForm({
      ...form,
      Category: value,
    });
  }

  function handleSave() {
    const payload = {
      ...form,
      Category:
        newCategory.trim() !== ""
          ? newCategory.trim()
          : form.Category,
    };

    onSave(payload);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-5">

      <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto">

        <div className="p-8">

          <h2 className="text-3xl font-bold">

            {form.id ? "Edit Product" : "Add Product"}

          </h2>

          <p className="text-gray-500 mt-2">

            Update your menu item.

          </p>

          <div className="mt-8">

            <div className="w-40 h-40 rounded-3xl bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 mx-auto">

              <div className="text-center">

                <div className="text-5xl">

                  📷

                </div>

                <div className="mt-2 text-sm text-gray-500">

                  Upload Image

                </div>

              </div>

            </div>

          </div>

          <div className="space-y-5 mt-8">            <input
              className="w-full border rounded-xl p-4"
              placeholder="Product Name"
              value={form.Name || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  Name: e.target.value,
                })
              }
            />

            <div>

              <label className="block text-sm font-semibold mb-2">
                Category
              </label>

              <select
                value={newCategory ? "__new__" : (form.Category || "")}
                onChange={(e) =>
                  handleCategoryChange(e.target.value)
                }
                className="w-full border rounded-xl p-4"
              >
                <option value="">Select Category</option>

                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}

                <option value="__new__">
                  + Create New Category
                </option>

              </select>

            </div>

            {(newCategory !== "" || form.Category === "") && (

              <input
                className="w-full border rounded-xl p-4"
                placeholder="New Category Name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />

            )}

            <input
              type="number"
              className="w-full border rounded-xl p-4"
              placeholder="Price"
              value={form.Price || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  Price: Number(e.target.value),
                })
              }
            />

            <textarea
              rows={4}
              className="w-full border rounded-xl p-4"
              placeholder="Description"
              value={form.Description || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  Description: e.target.value,
                })
              }
            />

            <div className="grid grid-cols-2 gap-4">

              <label className="flex items-center gap-3">

                <input
                  type="checkbox"
                  checked={form.Available ?? true}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      Available: e.target.checked,
                    })
                  }
                />

                Available

              </label>

              <label className="flex items-center gap-3">

                <input
                  type="checkbox"
                  checked={form.BestSeller ?? false}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      BestSeller: e.target.checked,
                    })
                  }
                />

                ⭐ Best Seller

              </label>

              <label className="flex items-center gap-3">

                <input
                  type="checkbox"
                  checked={form.TodaysSpecial ?? false}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      TodaysSpecial: e.target.checked,
                    })
                  }
                />

                🔥 Today's Special

              </label>

            </div>

            {form.id && (

              <button
                onClick={() =>
                  setForm({
                    ...form,
                    Archived: true,
                  })
                }
                className="w-full rounded-xl border border-red-300 text-red-600 py-3 font-semibold"
              >
                Archive Product
              </button>

            )}

          </div>

          <div className="flex gap-4 mt-10">

            <button
              onClick={onClose}
              className="flex-1 rounded-xl border py-4 font-semibold"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="flex-1 rounded-xl bg-green-700 text-white py-4 font-bold"
            >
              Save
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}