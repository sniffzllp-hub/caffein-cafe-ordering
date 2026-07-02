import { collection, getDocs } from "firebase/firestore";

import { db } from "./firebase";

function toDate(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isSameDay(a, b) {
  return (
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function currency(value) {
  return Number(value || 0);
}

export async function getRestaurantAnalytics() {
  const [ordersSnapshot, tablesSnapshot] = await Promise.all([
    getDocs(collection(db, "Orders")),
    getDocs(collection(db, "Tables")),
  ]);

  const today = new Date();
  const orders = ordersSnapshot.docs.map((orderDoc) => ({
    id: orderDoc.id,
    ...orderDoc.data(),
    createdDate: toDate(orderDoc.data().createdAt),
    closedDate: toDate(orderDoc.data().closedAt),
  }));

  const tables = tablesSnapshot.docs.map((tableDoc) => ({
    id: tableDoc.id,
    ...tableDoc.data(),
  }));

  const todaysOrders = orders.filter((order) => isSameDay(order.createdDate, today));
  const paidOrders = orders.filter((order) => order.status === "PAID");
  const todaysRevenue = todaysOrders.reduce((sum, order) => sum + currency(order.total), 0);
  const lifetimeRevenue = orders.reduce((sum, order) => sum + currency(order.total), 0);
  const openTables = tables.filter((table) => table.status === "OPEN");

  const itemMap = new Map();

  orders.forEach((order) => {
    (order.items || []).forEach((item) => {
      const current = itemMap.get(item.id || item.Name) || {
        id: item.id || item.Name,
        name: item.Name,
        quantity: 0,
        revenue: 0,
      };

      current.quantity += Number(item.qty || 0);
      current.revenue += Number(item.qty || 0) * Number(item.Price || 0);
      itemMap.set(current.id, current);
    });
  });

  const topItems = Array.from(itemMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8);

  const recentOrders = [...orders]
    .sort((a, b) => (b.createdDate?.getTime() || 0) - (a.createdDate?.getTime() || 0))
    .slice(0, 8);

  return {
    totals: {
      todaysRevenue,
      lifetimeRevenue,
      todaysOrders: todaysOrders.length,
      paidOrders: paidOrders.length,
      openTables: openTables.length,
      totalTables: tables.length,
      averageOrderValue: orders.length ? Math.round(lifetimeRevenue / orders.length) : 0,
    },
    topItems,
    recentOrders,
    openTables,
  };
}