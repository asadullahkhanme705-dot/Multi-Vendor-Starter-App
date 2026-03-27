import LandingPage from "@/pages/LandingPage";
import { Routes, Route } from "react-router";
import CustomerRegisterPage from "@/pages/auth/customerRegisterPage";
import VendorRegisterPage from "@/pages/auth/vendorRegisterPage";
import LoginPage from "@/pages/auth/LoginPage";
import CustomerDashboard from "@/pages/dashboard/CustomerDashboard";
import VendorDashboard from "@/pages/dashboard/VendorDashboard";
import ProtectedRoute from "./utils/ProtectedRoute";
import VendorCreateProduct from "./pages/vendor/VendorCreateProduct";

function App() {
  return (
    <>
      {/* <h1>New app</h1> */}
      <Routes>
        <Route element={<LoginPage />} path="/login" />
        <Route element={<LandingPage />} path="/" />
        <Route element={<CustomerRegisterPage />} path="/customer/register" />
        <Route element={<VendorRegisterPage />} path="/vendor/register" />
        <Route element={<ProtectedRoute />}>
          <Route element={<CustomerDashboard />} path="/customer/dashboard" />
          <Route element={<VendorDashboard />} path="/vendor/dashboard" />
          <Route
            element={<VendorCreateProduct />}
            path="/vendor/createProduct"
          />
        </Route>
      </Routes>
      {/* <LandingPage /> */}
    </>
  );
}

export default App;
