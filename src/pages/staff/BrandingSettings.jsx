import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import BrandLogo from "../../components/BrandLogo";
import { DEFAULT_BRANDING, getBranding, saveBranding } from "../../services/brandingService";
import { uploadMenuImage } from "../../services/imageService";

export default function BrandingSettings() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [branding, setBranding] = useState(DEFAULT_BRANDING);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBranding() {
      try {
        const data = await getBranding();
        setBranding(data);
      } catch (err) {
        console.error(err);
        setError("Branding could not be loaded.");
      }
    }

    loadBranding();
  }, []);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(branding.logoUrl || "");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [branding.logoUrl, selectedFile]);

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    setUploadProgress(0);

    try {
      let logoUrl = branding.logoUrl || "";

      if (selectedFile) {
        logoUrl = await uploadMenuImage(selectedFile, setUploadProgress);
      }

      await saveBranding({
        restaurantName: branding.restaurantName,
        logoUrl,
      });

      setBranding((current) => ({ ...current, logoUrl }));
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setNotice("Branding saved. The logo will now appear across the app.");
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not save branding.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRemoveLogo() {
    setBranding((current) => ({ ...current, logoUrl: "" }));
    setSelectedFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="min-h-screen bg-[#f5f0e8] text-stone-950">
      <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-[#f5f0e8]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
          <div className="flex items-center gap-4">
            <BrandLogo size="md" />
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-amber-700">Admin Settings</p>
              <h1 className="text-3xl font-black tracking-tight md:text-5xl">Branding</h1>
            </div>
          </div>
          <button
            onClick={() => navigate("/admin")}
            className="rounded-2xl bg-stone-950 px-5 py-3 font-bold text-white shadow-lg shadow-stone-950/15"
          >
            Back to Admin
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8">
        <form onSubmit={handleSave} className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-[2rem] bg-stone-950 p-6 text-white shadow-xl shadow-stone-950/10">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-amber-300">Preview</p>
            <div className="mt-8 flex flex-col items-center text-center">
              <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-[2rem] bg-white shadow-2xl">
                {previewUrl ? (
                  <img src={previewUrl} alt="Company logo preview" className="h-full w-full object-contain" />
                ) : (
                  <span className="text-7xl">☕</span>
                )}
              </div>
              <h2 className="mt-6 text-3xl font-black">{branding.restaurantName || DEFAULT_BRANDING.restaurantName}</h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-stone-300">
                This logo will show on customer ordering pages, staff screens, and admin headers.
              </p>
            </div>
          </section>

          <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-black/5">
            <label className="text-sm font-black uppercase tracking-[0.18em] text-stone-400" htmlFor="restaurant-name">
              Restaurant name
            </label>
            <input
              id="restaurant-name"
              value={branding.restaurantName || ""}
              onChange={(event) => setBranding((current) => ({ ...current, restaurantName: event.target.value }))}
              className="mt-3 w-full rounded-2xl border border-stone-200 px-5 py-4 text-lg font-bold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-200/40"
              placeholder="Caffein Cafe"
              disabled={saving}
            />

            <div className="mt-8">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-stone-400">Company logo</p>
              <p className="mt-2 text-sm leading-6 text-stone-500">
                Upload one PNG, JPG, or WebP logo. Large images are optimized before upload.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={saving}
                  className="rounded-2xl bg-stone-950 px-5 py-3 font-black text-white disabled:opacity-60"
                >
                  Choose Logo
                </button>
                {(previewUrl || selectedFile) && (
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    disabled={saving}
                    className="rounded-2xl border border-red-200 px-5 py-3 font-black text-red-700 disabled:opacity-60"
                  >
                    Remove Logo
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                disabled={saving}
                onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
              />
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-6">
                <div className="mb-2 flex justify-between text-sm font-bold text-stone-500">
                  <span>Uploading logo</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-stone-100">
                  <div className="h-full bg-amber-400 transition-all" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}

            {notice && <p className="mt-6 rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-700">{notice}</p>}
            {error && <p className="mt-6 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p>}

            <button
              type="submit"
              disabled={saving}
              className="mt-8 w-full rounded-2xl bg-amber-400 py-4 font-black text-stone-950 shadow-lg shadow-amber-950/10 transition hover:bg-amber-300 disabled:opacity-60"
            >
              {saving ? "Saving Branding..." : "Save Branding"}
            </button>
          </section>
        </form>
      </main>
    </div>
  );
}