import { useEffect, useRef, useState } from "react";

import { validateMenuImage } from "../../services/imageService";

export default function ProductImageUploader({
  imageUrl,
  selectedFile,
  disabled,
  onFileChange,
  onRemove,
}) {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(imageUrl || "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(imageUrl || "");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageUrl, selectedFile]);

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      validateMenuImage(file);
      setError("");
      onFileChange(file);
    } catch (validationError) {
      setError(validationError.message);
      event.target.value = "";
    }
  }

  function handleRemove() {
    setError("");
    if (inputRef.current) inputRef.current.value = "";
    onRemove();
  }

  return (
    <div>
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="group relative h-40 w-40 shrink-0 overflow-hidden rounded-3xl border-2 border-dashed border-gray-300 bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {previewUrl ? (
            <>
              <img
                src={previewUrl}
                alt="Product preview"
                className="h-full w-full object-cover"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-sm font-bold text-white opacity-0 transition group-hover:opacity-100">
                Change image
              </span>
            </>
          ) : (
            <span className="flex h-full flex-col items-center justify-center text-gray-500">
              <span className="text-4xl">📷</span>
              <span className="mt-2 text-sm font-semibold">Add image</span>
            </span>
          )}
        </button>

        <div className="text-center sm:text-left">
          <p className="font-semibold text-gray-900">Product photograph</p>
          <p className="mt-1 text-sm text-gray-500">
            JPG, PNG, or WebP. Maximum size 5 MB.
          </p>
          <div className="mt-3 flex justify-center gap-3 sm:justify-start">
            <button
              type="button"
              disabled={disabled}
              onClick={() => inputRef.current?.click()}
              className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {previewUrl ? "Replace" : "Choose image"}
            </button>
            {previewUrl && (
              <button
                type="button"
                disabled={disabled}
                onClick={handleRemove}
                className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 disabled:opacity-60"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        disabled={disabled}
        onChange={handleFileChange}
        className="hidden"
      />
      {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}