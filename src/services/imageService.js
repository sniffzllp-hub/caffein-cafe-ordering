import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import { storage } from "./firebase";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

function sanitizeFileName(fileName) {
  return fileName
    .toLowerCase()
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function validateMenuImage(file) {
  if (!file) {
    throw new Error("Choose an image to upload.");
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Use a JPG, PNG, or WebP image.");
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("The image must be 5 MB or smaller.");
  }
}

export function uploadMenuImage(file, onProgress) {
  validateMenuImage(file);

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeName = sanitizeFileName(file.name) || "product";
  const uniqueId = crypto.randomUUID();
  const imageRef = ref(
    storage,
    `menu-products/${uniqueId}-${safeName}.${extension}`,
  );

  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(imageRef, file, {
      contentType: file.type,
      cacheControl: "public,max-age=31536000,immutable",
    });

    task.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        );
        onProgress?.(progress);
      },
      reject,
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve(url);
        } catch (error) {
          reject(error);
        }
      },
    );
  });
}

export async function deleteMenuImage(imageUrl) {
  if (!imageUrl) return;

  try {
    await deleteObject(ref(storage, imageUrl));
  } catch (error) {
    if (error?.code !== "storage/object-not-found") {
      throw error;
    }
  }
}