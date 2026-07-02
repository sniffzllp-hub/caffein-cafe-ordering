import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import { storage } from "./firebase";

const MAX_SOURCE_IMAGE_SIZE = 15 * 1024 * 1024;
const MAX_UPLOAD_IMAGE_SIZE = 3 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 1600;
const UPLOAD_TIMEOUT_MS = 60000;
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

function getImageExtension(file) {
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Could not prepare this image for upload."));
        }
      },
      type,
      quality,
    );
  });
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("This image could not be opened. Please choose another file."));
    };

    image.src = objectUrl;
  });
}

async function prepareImageForUpload(file) {
  if (file.size <= MAX_UPLOAD_IMAGE_SIZE) {
    return file;
  }

  const image = await loadImage(file);
  const scale = Math.min(
    1,
    MAX_IMAGE_DIMENSION / Math.max(image.width, image.height),
  );
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d", { alpha: file.type === "image/png" });
  if (!context) {
    throw new Error("Image processing is not available in this browser.");
  }

  context.drawImage(image, 0, 0, width, height);

  const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
  const blob = await canvasToBlob(canvas, outputType, 0.82);

  if (blob.size > MAX_UPLOAD_IMAGE_SIZE) {
    throw new Error("This image is still too large after optimization. Please choose a smaller image.");
  }

  return new File([blob], file.name, {
    type: outputType,
    lastModified: Date.now(),
  });
}

export function validateMenuImage(file) {
  if (!file) {
    throw new Error("Choose an image to upload.");
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Use a JPG, PNG, or WebP image.");
  }

  if (file.size > MAX_SOURCE_IMAGE_SIZE) {
    throw new Error("The image must be 15 MB or smaller.");
  }
}

export async function uploadMenuImage(file, onProgress) {
  validateMenuImage(file);

  if (!storage.app.options.storageBucket) {
    throw new Error("Firebase Storage is not configured. Check the VITE_FIREBASE_STORAGE_BUCKET setting in Vercel.");
  }

  const preparedFile = await prepareImageForUpload(file);
  const extension = getImageExtension(preparedFile);
  const safeName = sanitizeFileName(file.name) || "product";
  const uniqueId = crypto.randomUUID();
  const imageRef = ref(
    storage,
    `menu-products/${uniqueId}-${safeName}.${extension}`,
  );

  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(imageRef, preparedFile, {
      contentType: preparedFile.type,
      cacheControl: "public,max-age=31536000,immutable",
    });

    const timeout = window.setTimeout(() => {
      task.cancel();
      reject(new Error("Image upload timed out. Please check Firebase Storage rules or try a smaller image."));
    }, UPLOAD_TIMEOUT_MS);

    task.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        );
        onProgress?.(progress);
      },
      (error) => {
        window.clearTimeout(timeout);

        if (error?.code === "storage/unauthorized") {
          reject(new Error("Firebase Storage rejected the upload. Please allow admin image uploads in Storage rules."));
          return;
        }

        if (error?.code === "storage/canceled") {
          reject(new Error("Image upload was canceled because it took too long."));
          return;
        }

        reject(error);
      },
      async () => {
        window.clearTimeout(timeout);

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