import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function getCurrentOrder(tableId) {
  const tableRef = doc(db, "Tables", String(tableId));
  const tableSnap = await getDoc(tableRef);

  if (!tableSnap.exists()) {
    throw new Error("Table not found.");
  }

  const table = tableSnap.data();

  if (!table.currentOrderId) {
    return null;
  }

  const orderRef = doc(db, "Orders", table.currentOrderId);
  const orderSnap = await getDoc(orderRef);

  if (!orderSnap.exists()) {
    return null;
  }

  return {
    id: orderSnap.id,
    ...orderSnap.data(),
  };
}