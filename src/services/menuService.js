import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "./firebase";

const MENU_COLLECTION = "Menu";

export async function getMenu() {
  const snapshot = await getDocs(collection(db, MENU_COLLECTION));

  const items = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return items
    .filter((item) => !item.Archived)
    .sort((a, b) => {
      const categoryA = a.Category || "";
      const categoryB = b.Category || "";

      if (categoryA === categoryB) {
        return (a.Name || "").localeCompare(b.Name || "");
      }

      return categoryA.localeCompare(categoryB);
    });
}

export async function addMenuItem(item) {
  const payload = {
    Name: "",
    Description: "",
    Category: "",
    Price: 0,
    Image: "",
    Available: true,
    BestSeller: false,
    TodaysSpecial: false,
    Archived: false,
    ...item,
  };

  return await addDoc(collection(db, MENU_COLLECTION), payload);
}

export async function updateMenuItem(id, item) {
  return await updateDoc(
    doc(db, MENU_COLLECTION, id),
    item
  );
}

export async function archiveMenuItem(id) {
  return await updateDoc(
    doc(db, MENU_COLLECTION, id),
    {
      Archived: true,
    }
  );
}

export async function restoreMenuItem(id) {
  return await updateDoc(
    doc(db, MENU_COLLECTION, id),
    {
      Archived: false,
    }
  );
}

export async function deleteMenuItem(id) {
  return await deleteDoc(
    doc(db, MENU_COLLECTION, id)
  );
}