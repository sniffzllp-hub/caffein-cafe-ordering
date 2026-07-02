import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Home from "./pages/customer/Home";
import Menu from "./pages/customer/Menu";
import Cart from "./pages/customer/Cart";
import OrderSuccess from "./pages/customer/OrderSuccess";

import StaffAuthGate from "./components/staff/StaffAuthGate";
import StaffDashboard from "./pages/staff/StaffDashboard";
import AdminDashboard from "./pages/staff/AdminDashboard";
import MenuStudio from "./pages/staff/MenuStudio";
import ViewOrder from "./pages/staff/ViewOrder";
import CategoryItems from "./pages/staff/CategoryItems";
import AnalyticsDashboard from "./pages/staff/AnalyticsDashboard";
import TableSetup from "./pages/staff/TableSetup";
import BrandingSettings from "./pages/staff/BrandingSettings";

function ProtectedStaffRoute({ children, area = "staff" }) {
  return <StaffAuthGate area={area}>{children}</StaffAuthGate>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer */}
        <Route path="/" element={<Home />} />
        <Route path="/t/:tableToken" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/success" element={<OrderSuccess />} />

        {/* Staff */}
        <Route
          path="/staff"
          element={
            <ProtectedStaffRoute area="staff">
              <StaffDashboard />
            </ProtectedStaffRoute>
          }
        />
        <Route
          path="/order/:tableId"
          element={
            <ProtectedStaffRoute area="staff">
              <ViewOrder />
            </ProtectedStaffRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedStaffRoute area="admin">
              <AdminDashboard />
            </ProtectedStaffRoute>
          }
        />
        <Route
          path="/menu-studio"
          element={
            <ProtectedStaffRoute area="admin">
              <MenuStudio />
            </ProtectedStaffRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedStaffRoute area="admin">
              <AnalyticsDashboard />
            </ProtectedStaffRoute>
          }
        />
        <Route
          path="/table-setup"
          element={
            <ProtectedStaffRoute area="admin">
              <TableSetup />
            </ProtectedStaffRoute>
          }
        />
        <Route
          path="/branding"
          element={
            <ProtectedStaffRoute area="admin">
              <BrandingSettings />
            </ProtectedStaffRoute>
          }
        />
        <Route
          path="/admin/menu/:category"
          element={
            <ProtectedStaffRoute area="admin">
              <CategoryItems />
            </ProtectedStaffRoute>
          }
        />

        {/* Temporary compatibility */}
        <Route path="/dashboard" element={<Navigate to="/staff" replace />} />
      </Routes>
    </BrowserRouter>
  );
}