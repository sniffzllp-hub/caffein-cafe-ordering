import { useState } from "react";

import {
  downloadMenuImportTemplate,
  parseMenuImportFile,
} from "../../services/menuImportService";

export default function MenuImportModal({ open, onClose, onImport }) {
  const [fileName, setFileName] = useState("");
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  if (!open) return null;

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setItems([]);
    setError("");
    setIsParsing(true);

    try {
      setItems(await parseMenuImportFile(file));
    } catch (parseError) {
      setError(parseError.message || "Unable to read this menu file.");
    } finally {
      setIsParsing(false);
    }
  }

  async function handleImport() {
    setIsImporting(true);
    setError("");

    try {
      await onImport(items);
      setFileName("");
      setItems([]);
      onClose();
    } catch (importError) {
      setError(importError.message || "The menu could not be imported.");
    } finally {
      setIsImporting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 p-5">
      <div className="w-full max-w-xl rounded-3xl bg-white p-7 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Import menu</h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Add products in bulk from CSV or JSON. Existing products are not removed or overwritten.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isImporting}
            aria-label="Close import"
            className="rounded-full bg-gray-100 px-3 py-1.5 text-xl"
          >
            ×
          </button>
        </div>

        <button
          type="button"
          onClick={downloadMenuImportTemplate}
          className="mt-5 text-sm font-bold text-green-700"
        >
          Download CSV template
        </button>

        <label className="mt-5 flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center hover:border-green-600">
          <span className="text-3xl">📄</span>
          <span className="mt-2 font-bold">{fileName || "Choose CSV or JSON file"}</span>
          <span className="mt-1 text-sm text-gray-500">Maximum 1,000 products per import</span>
          <input
            type="file"
            accept=".csv,.json,text/csv,application/json"
            onChange={handleFileChange}
            disabled={isParsing || isImporting}
            className="hidden"
          />
        </label>

        {isParsing && <p className="mt-4 text-sm font-semibold text-gray-600">Checking menu file…</p>}

        {items.length > 0 && (
          <div className="mt-5 rounded-2xl bg-green-50 p-4">
            <p className="font-bold text-green-800">{items.length} products ready to import</p>
            <p className="mt-1 text-sm text-green-700">
              {new Set(items.map((item) => item.Category)).size} categories detected
            </p>
          </div>
        )}

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>
        )}

        <div className="mt-7 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isImporting}
            className="flex-1 rounded-xl border border-gray-200 py-3 font-bold"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={items.length === 0 || isImporting}
            className="flex-1 rounded-xl bg-green-700 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isImporting ? "Importing…" : "Import products"}
          </button>
        </div>
      </div>
    </div>
  );
}