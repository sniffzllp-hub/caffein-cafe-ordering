import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import OrderSuccess from "./pages/OrderSuccess";
import Dashboard from "./pages/Dashboard";
import ViewOrder from "./pages/ViewOrder";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/menu" element={<Menu />} />

        <Route path="/cart" element={<Cart />} />

        <Route path="/success" element={<OrderSuccess />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/order/:tableId" element={<ViewOrder />} />

      </Routes>
    </BrowserRouter>
  );
}