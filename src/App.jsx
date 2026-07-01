import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/customer/Home";
import Menu from "./pages/customer/Menu";
import Cart from "./pages/customer/Cart";
import OrderSuccess from "./pages/customer/OrderSuccess";

import StaffDashboard from "./pages/staff/StaffDashboard";
import AdminDashboard from "./pages/staff/AdminDashboard";
import MenuStudio from "./pages/staff/MenuStudio";
import ViewOrder from "./pages/staff/ViewOrder";
import CategoryItems from "./pages/staff/CategoryItems";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Customer */}

        <Route path="/" element={<Home />} />

        <Route path="/menu" element={<Menu />} />

        <Route path="/cart" element={<Cart />} />

        <Route path="/success" element={<OrderSuccess />} />

        {/* Staff */}

        <Route path="/staff" element={<StaffDashboard />} />

        {/* Admin */}

        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/menu-studio" element={<MenuStudio />} />

        <Route path="/order/:tableId" element={<ViewOrder />} />

        <Route
  path="/admin/menu/:category"
  element={<CategoryItems />}
/>

        {/* Temporary compatibility */}

        <Route
          path="/dashboard"
          element={<Navigate to="/staff" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}