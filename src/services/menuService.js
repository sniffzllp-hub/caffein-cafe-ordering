import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export async function getMenu() {
  const snapshot = await getDocs(collection(db, "Menu"));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}