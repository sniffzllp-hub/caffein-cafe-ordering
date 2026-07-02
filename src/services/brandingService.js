import { doc, getDoc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";

import { db } from "./firebase";

const BRANDING_REF = doc(db, "Settings", "branding");

export const DEFAULT_BRANDING = {
  restaurantName: "Caffein Cafe",
  logoUrl: "",
};

export function watchBranding(onChange, onError) {
  return onSnapshot(
    BRANDING_REF,
    (snapshot) => {
      if (!snapshot.exists()) {
        onChange(DEFAULT_BRANDING);
        return;
      }

      onChange({
        ...DEFAULT_BRANDING,
        ...snapshot.data(),
      });
    },
    onError,
  );
}

export async function getBranding() {
  const snapshot = await getDoc(BRANDING_REF);

  if (!snapshot.exists()) {
    return DEFAULT_BRANDING;
  }

  return {
    ...DEFAULT_BRANDING,
    ...snapshot.data(),
  };
}

export async function saveBranding(branding) {
  await setDoc(
    BRANDING_REF,
    {
      ...branding,
      restaurantName: String(branding.restaurantName || DEFAULT_BRANDING.restaurantName).trim(),
      logoUrl: branding.logoUrl || "",
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}