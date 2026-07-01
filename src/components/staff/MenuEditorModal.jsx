import { useEffect, useMemo, useState } from "react";

import ProductImageUploader from "./ProductImageUploader";

const EMPTY_PRODUCT = {
  Name: "",
  Description: "",
  Price: "",
  Category: "",
  Image: "",
  Available: true,
  BestSeller: false,
  TodaysSpecial: false,
  Archived: false,
};

export default function MenuEditorModal({
  open,
  item,
  menuItems,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [newCategory, setNewCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    setForm({ ...EMPTY_PRODUCT, ...(item || {}) });
    setNewCategory("");
    setImageFile(null);
    setRemoveImage(false);
    setUploadProgress(0);
    setError("");
  }, [item, open]);

  const categories = useMemo(
    () =>
      [...new Set((menuItems || []).map((menuItem) => menuItem.Category).filter(Boolean))]
        .sort((first, second) => first.localeCompare(second)),
    [menuItems],
  );

  if (!open) return null;

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleCategoryChange(value) {
    if (value === "__new__") {
      setNewCategory("");
      updateField("Category", "");
      return;
    }

    setNewCategory("");
    updateField("Category", value);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const category = newCategory.trim() || String(form.Category || "").trim();
    const price = Number(form.Price);

    if (!String(form.Name || "").trim()) {
      setError("Product name is required.");
      return;
    }
    if (!category) {
      setError("Choose or create a category.");
      return;
    }
    if (!Number.isFinite(price) || price < 0) {
      setError("Enter a valid price of zero or more.");
      return;
    }

    setIsSaving(true);
    setUploadProgress(0);
    setError("");

    try {
      await onSave(
        {
          ...form,
          Name: form.Name.trim(),
          Description: String(form.Description || "").trim(),
          Category: category,
          Price: price,
        },
        { imageFile, removeImage },
        setUploadProgress,
      );
    } catch (saveError) {
      setError(saveError.message || "Unable to save this product.");
    } finally {
      setIsSaving(false);
    }
  }

  const displayedImage = removeImage ? "" : form.Image;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
      <form
        onSubmit={handleSubmit}
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold">
                {form.id ? "Edit Product" : "Add Product"}
              </h2>
              <p className="mt-2 text-gray-500">Manage how this item appears on the customer menu.</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              aria-label="Close editor"
              className="rounded-full bg-gray-100 px-3 py-1.5 text-xl disabled:opacity-50"
            >
              ×
            </button>
          </div>

          <div className="mt-8">
            <ProductImageUploader
              imageUrl={displayedImage}
              selectedFile={imageFile}
              disabled={isSaving}
              onFileChange={(file) => {
                setImageFile(file);
                setRemoveImage(false);
              }}
              onRemove={() => {
                setImageFile(null);
                setRemoveImage(true);
              }}
            />
          </div>

          <div className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold">Product name</label>
              <input
                className="w-full rounded-xl border border-gray-300 p-4 focus:border-green-700 focus:outline-none"
                placeholder="Example: Cappuccino"
                value={form.Name || ""}
                disabled={isSaving}
                onChange={(event) => updateField("Name", event.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Category</label>
              <select
                value={newCategory !== "" ? "__new__" : form.Category || ""}
                disabled={isSaving}
                onChange={(event) => handleCategoryChange(event.target.value)}
                className="w-full rounded-xl border border-gray-300 p-4 focus:border-green-700 focus:outline-none"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
                <option value="__new__">+ Create new category</option>
              </select>
            </div>

            {(newCategory !== "" || form.Category === "") && (
              <input
                className="w-full rounded-xl border border-gray-300 p-4 focus:border-green-700 focus:outline-none"
                placeholder="New category name"
                value={newCategory}
                disabled={isSaving}
                onChange={(event) => setNewCategory(event.target.value)}
              />
            )}

            <div>
              <label className="mb-2 block text-sm font-semibold">Price (₹)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="w-full rounded-xl border border-gray-300 p-4 focus:border-green-700 focus:outline-none"
                placeholder="0"
                value={form.Price ?? ""}
                disabled={isSaving}
                onChange={(event) => updateField("Price", event.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Description</label>
              <textarea
                rows={4}
                className="w-full rounded-xl border border-gray-300 p-4 focus:border-green-700 focus:outline-none"
                placeholder="Describe the product"
                value={form.Description || ""}
                disabled={isSaving}
                onChange={(event) => updateField("Description", event.target.value)}
              />
            </div>

            <div className="grid gap-3 rounded-2xl bg-gray-50 p-5 sm:grid-cols-3">
              {[
                ["Available", "Available"],
                ["BestSeller", "⭐ Best seller"],
                ["TodaysSpecial", "🔥 Today's special"],
              ].map(([field, label]) => (
                <label key={field} className="flex items-center gap-3 text-sm font-semibold">
                  <input
                    type="checkbox"
                    checked={Boolean(form[field])}
                    disabled={isSaving || (field === "Available" && form.Archived)}
                    onChange={(event) => updateField(field, event.target.checked)}
                    className="h-5 w-5 accent-green-700"
                  />
                  {label}
                </label>
              ))}
            </div>

            {form.id && (
              <button
                type="button"
                disabled={isSaving}
                onClick={() => updateField("Archived", !form.Archived)}
                className={`w-full rounded-xl border py-3 font-semibold ${
                  form.Archived
                    ? "border-green-300 text-green-700"
                    : "border-red-300 text-red-600"
                }`}
              >
                {form.Archived ? "Restore Product" : "Archive Product"}
              </button>
            )}
          </div>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-5">
              <div className="mb-2 flex justify-between text-sm font-semibold text-gray-600">
                <span>Uploading image</span><span>{uploadProgress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                <div className="h-full bg-green-700 transition-all" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}

          {error && (
            <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>
          )}

          <div className="mt-8 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 rounded-xl border border-gray-300 py-4 font-semibold disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 rounded-xl bg-green-700 py-4 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving…" : "Save Product"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}