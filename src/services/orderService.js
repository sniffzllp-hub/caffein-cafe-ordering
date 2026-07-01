import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "./firebase";

export async function placeOrder(table, mobile, cart, total) {
  const tableRef = doc(db, "Tables", String(table));
  const tableSnap = await getDoc(tableRef);

  if (!tableSnap.exists()) {
    throw new Error("Table not found.");
  }

  const tableData = tableSnap.data();

  // Existing Open Order
  if (tableData.currentOrderId) {
    const orderRef = doc(db, "Orders", tableData.currentOrderId);
    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists()) {
      throw new Error("Current order not found.");
    }

    const orderData = orderSnap.data();

    const mergedItems = [...orderData.items];

    cart.forEach((newItem) => {
      const existing = mergedItems.find((i) => i.id === newItem.id);

      if (existing) {
        existing.qty += newItem.qty;
      } else {
        mergedItems.push({
          id: newItem.id,
          Name: newItem.Name,
          Price: newItem.Price,
          qty: newItem.qty,
        });
      }
    });

    const newTotal = mergedItems.reduce(
      (sum, item) => sum + item.Price * item.qty,
      0
    );

    await updateDoc(orderRef, {
      items: mergedItems,
      total: newTotal,
    });

    await updateDoc(tableRef, {
      total: newTotal,
    });

    return;
  }

  // First Order
  const orderRef = await addDoc(collection(db, "Orders"), {
    table,
    mobile,
    items: cart,
    total,
    status: "OPEN",
    createdAt: serverTimestamp(),
  });

  await updateDoc(tableRef, {
    currentOrderId: orderRef.id,
    mobile,
    total,
    status: "OPEN",
  });
}

export async function closeTable(tableId) {
  const tableRef = doc(db, "Tables", String(tableId));
  const tableSnap = await getDoc(tableRef);

  if (!tableSnap.exists()) {
    throw new Error("Table not found.");
  }

  const table = tableSnap.data();

  if (table.currentOrderId) {
    await updateDoc(
      doc(db, "Orders", table.currentOrderId),
      {
        status: "PAID",
        closedAt: serverTimestamp(),
      }
    );
  }

  await updateDoc(tableRef, {
    status: "CLOSED",
    mobile: "",
    total: 0,
    currentOrderId: "",
  });
}

export async function reopenTable(tableId) {
  const tableRef = doc(db, "Tables", String(tableId));
  const tableSnap = await getDoc(tableRef);

  if (!tableSnap.exists()) {
    throw new Error("Table not found.");
  }

  const table = tableSnap.data();

  if (!table.currentOrderId) {
    throw new Error("No order to reopen.");
  }

  await updateDoc(
    doc(db, "Orders", table.currentOrderId),
    {
      status: "OPEN",
    }
  );

  await updateDoc(tableRef, {
    status: "OPEN",
  });
}