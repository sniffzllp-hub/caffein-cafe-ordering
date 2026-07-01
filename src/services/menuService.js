import {
  addDoc,
  collection,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";

import { db } from "./firebase";

const MENU_COLLECTION = "Menu";
const IMPORT_BATCH_SIZE = 400;

function normalizeMenuItem(item) {
  return {
    Name: String(item.Name || "").trim(),
    Description: String(item.Description || "").trim(),
    Category: String(item.Category || "").trim(),
    Price: Number(item.Price) || 0,
    Image: String(item.Image || "").trim(),
    Available: item.Available ?? true,
    BestSeller: item.BestSeller ?? false,
    TodaysSpecial: item.TodaysSpecial ?? false,
    Archived: item.Archived ?? false,
  };
}

function sortMenuItems(items) {
  return [...items].sort((first, second) => {
    const categoryComparison = (first.Category || "").localeCompare(
      second.Category || "",
    );

    if (categoryComparison !== 0) return categoryComparison;

    return (first.Name || "").localeCompare(second.Name || "");
  });
}

export async function getMenu(options = {}) {
  const { includeArchived = false } = options;
  const snapshot = await getDocs(collection(db, MENU_COLLECTION));
  const items = snapshot.docs.map((snapshotDoc) => ({
    id: snapshotDoc.id,
    ...snapshotDoc.data(),
  }));

  return sortMenuItems(
    includeArchived ? items : items.filter((item) => !item.Archived),
  );
}

export async function addMenuItem(item) {
  return addDoc(collection(db, MENU_COLLECTION), {
    ...normalizeMenuItem(item),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateMenuItem(id, item) {
  return updateDoc(doc(db, MENU_COLLECTION, id), {
    ...normalizeMenuItem(item),
    updatedAt: serverTimestamp(),
  });
}

export async function archiveMenuItem(id) {
  return updateDoc(doc(db, MENU_COLLECTION, id), {
    Archived: true,
    updatedAt: serverTimestamp(),
  });
}

export async function restoreMenuItem(id) {
  return updateDoc(doc(db, MENU_COLLECTION, id), {
    Archived: false,
    updatedAt: serverTimestamp(),
  });
}

export async function importMenuItems(items) {
  let imported = 0;

  for (let start = 0; start < items.length; start += IMPORT_BATCH_SIZE) {
    const batch = writeBatch(db);
    const batchItems = items.slice(start, start + IMPORT_BATCH_SIZE);

    batchItems.forEach((item) => {
      const itemRef = doc(collection(db, MENU_COLLECTION));
      batch.set(itemRef, {
        ...normalizeMenuItem(item),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    });

    await batch.commit();
    imported += batchItems.length;
  }

  return imported;
}