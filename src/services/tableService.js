import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "./firebase";

const TABLE_COLLECTION = "Tables";

function makeTableToken(tableNumber) {
  const random = crypto.getRandomValues(new Uint32Array(2));
  return `cf-${tableNumber}-${random[0].toString(36)}${random[1].toString(36)}`;
}

export function getCustomerLink(table) {
  return `${window.location.origin}/t/${table.token}`;
}

export function getLegacyCustomerLink(tableId) {
  return `${window.location.origin}/?table=${tableId}`;
}

export async function getTable(tableNumber) {
  const tableRef = doc(db, TABLE_COLLECTION, String(tableNumber));
  const snapshot = await getDoc(tableRef);

  if (!snapshot.exists()) {
    throw new Error("Table not found.");
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

export async function getTables() {
  const snapshot = await getDocs(collection(db, TABLE_COLLECTION));
  const tables = snapshot.docs.map((tableDoc) => ({
    id: tableDoc.id,
    ...tableDoc.data(),
  }));

  return tables.sort(
    (a, b) => Number(a.tableNumber || a.id) - Number(b.tableNumber || b.id)
  );
}

export async function updateTable(tableNumber, data) {
  const tableRef = doc(db, TABLE_COLLECTION, String(tableNumber));
  await updateDoc(tableRef, data);
}

export async function ensureTableToken(tableId) {
  const tableRef = doc(db, TABLE_COLLECTION, String(tableId));
  const tableSnap = await getDoc(tableRef);

  if (!tableSnap.exists()) {
    throw new Error("Table not found.");
  }

  const table = tableSnap.data();

  if (table.token) {
    return table.token;
  }

  const token = makeTableToken(tableId);
  await updateDoc(tableRef, { token });
  return token;
}

export async function resolveTableAccess({ token, tableId }) {
  if (token) {
    const tableQuery = query(
      collection(db, TABLE_COLLECTION),
      where("token", "==", token)
    );

    const snapshot = await getDocs(tableQuery);

    if (!snapshot.empty) {
      const tableDoc = snapshot.docs[0];
      return {
        id: tableDoc.id,
        token,
        ...tableDoc.data(),
      };
    }
  }

  if (tableId) {
    const tableRef = doc(db, TABLE_COLLECTION, String(tableId));
    const tableSnap = await getDoc(tableRef);

    if (tableSnap.exists()) {
      const table = tableSnap.data();
      const ensuredToken = table.token || (await ensureTableToken(tableId));

      return {
        id: tableSnap.id,
        token: ensuredToken,
        ...table,
      };
    }
  }

  throw new Error("Invalid table link. Please scan the QR code again or ask staff for help.");
}

export async function generateTables(count) {
  const total = Number(count);

  if (!Number.isInteger(total) || total < 1 || total > 250) {
    throw new Error("Enter a table count between 1 and 250.");
  }

  const writes = [];

  for (let i = 1; i <= total; i += 1) {
    const tableRef = doc(db, TABLE_COLLECTION, String(i));
    const tableSnap = await getDoc(tableRef);

    if (tableSnap.exists()) {
      const table = tableSnap.data();
      writes.push(
        setDoc(
          tableRef,
          {
            tableNumber: Number(table.tableNumber || i),
            status: table.status || "CLOSED",
            mobile: table.mobile || "",
            total: Number(table.total || 0),
            currentOrderId: table.currentOrderId || "",
            token: table.token || makeTableToken(i),
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        ),
      );
    } else {
      writes.push(
        setDoc(tableRef, {
          tableNumber: i,
          status: "CLOSED",
          mobile: "",
          total: 0,
          currentOrderId: "",
          token: makeTableToken(i),
          updatedAt: serverTimestamp(),
        })
      );
    }
  }

  await Promise.all(writes);
}

export async function resetFloorTables(count = 20) {
  const total = Number(count);

  if (!Number.isInteger(total) || total < 1 || total > 250) {
    throw new Error("Enter a table count between 1 and 250.");
  }

  await generateTables(total);

  const tables = await getTables();
  await Promise.all(
    tables.map((table) =>
      setDoc(
        doc(db, TABLE_COLLECTION, String(table.id)),
        {
          tableNumber: Number(table.tableNumber || table.id),
          status: "CLOSED",
          mobile: "",
          total: 0,
          currentOrderId: "",
          token: table.token || makeTableToken(table.id),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      ),
    ),
  );
}

export async function refreshTableToken(tableId) {
  const token = makeTableToken(tableId);
  await updateDoc(doc(db, TABLE_COLLECTION, String(tableId)), { token });
  return token;
}