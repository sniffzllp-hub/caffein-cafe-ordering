import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function getTable(tableNumber) {
  const tableRef = doc(db, "Tables", String(tableNumber));
  const snapshot = await getDoc(tableRef);

  if (!snapshot.exists()) {
    throw new Error("Table not found.");
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

export async function updateTable(tableNumber, data) {
  const tableRef = doc(db, "Tables", String(tableNumber));

  await updateDoc(tableRef, data);
}