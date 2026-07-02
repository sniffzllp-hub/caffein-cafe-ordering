import { useEffect, useState } from "react";

import { DEFAULT_BRANDING, watchBranding } from "../services/brandingService";

const sizeClasses = {
  sm: "h-9 w-9 rounded-xl text-xl",
  md: "h-12 w-12 rounded-2xl text-2xl",
  lg: "h-16 w-16 rounded-3xl text-3xl",
  xl: "h-24 w-24 rounded-[2rem] text-5xl",
};

export default function BrandLogo({ size = "md", showName = false, nameClassName = "", className = "" }) {
  const [branding, setBranding] = useState(DEFAULT_BRANDING);

  useEffect(() => {
    const unsubscribe = watchBranding(setBranding, (error) => {
      console.error("Branding could not be loaded.", error);
      setBranding(DEFAULT_BRANDING);
    });

    return () => unsubscribe();
  }, []);

  const logoSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`flex shrink-0 items-center justify-center overflow-hidden bg-amber-300 shadow-lg shadow-amber-950/20 ${logoSize}`}>
        {branding.logoUrl ? (
          <img
            src={branding.logoUrl}
            alt={`${branding.restaurantName} logo`}
            className="h-full w-full object-contain bg-white"
          />
        ) : (
          <span>☕</span>
        )}
      </div>

      {showName && (
        <div className={nameClassName}>
          {branding.restaurantName || DEFAULT_BRANDING.restaurantName}
        </div>
      )}
    </div>
  );
}