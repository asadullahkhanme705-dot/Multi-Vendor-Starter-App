import { useState, useEffect } from "react";
import { Link } from "react-router";
import API from "../../api/axios";

export default function VendorDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // ✅ Products state
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // ✅ Orders state
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // ✅ Stats
  const [stats, setStats] = useState({ revenue: 0, orders: 0, products: 0 });

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // ✅ Edit product
  const handleEdit = (productId) => {
    window.location.href = `/vendor/product/${productId}/edit`;
  };

  // ✅ Delete product
  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await API.delete(`/product/${productId}`);
      setProducts(products.filter((p) => p._id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  // ✅ Fetch data when tab changes
  useEffect(() => {
    if (activeTab === "products") {
      const fetchProducts = async () => {
        try {
          setLoadingProducts(true);

          const res = await API.get("product/vendor/all");

          setProducts(res.data);
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setLoadingProducts(false);
        }
      };

      fetchProducts();
    } else if (activeTab === "orders") {
      const fetchOrders = async () => {
        try {
          setLoadingOrders(true);

          const res = await API.get("order/my-vendor");

          setOrders(res.data);
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setLoadingOrders(false);
        }
      };

      fetchOrders();
    } else if (activeTab === "dashboard") {
      // Fetch both for stats
      const fetchStats = async () => {
        try {
          const [productsRes, ordersRes] = await Promise.all([
            API.get("product/vendor/all"),
            API.get("order/my-vendor"),
          ]);

          setProducts(productsRes.data);
          setOrders(ordersRes.data);

          const revenue = ordersRes.data.reduce(
            (sum, order) => sum + (order.totalAmount || 0),
            0,
          );
          setStats({
            revenue,
            orders: ordersRes.data.length,
            products: productsRes.data.length,
          });
        } catch (error) {
          console.error("Error fetching stats:", error);
        }
      };

      fetchStats();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 🔝 Navbar */}
      <header className="sticky top-0 z-50 bg-black border-b border-gray-800">
        <div className="flex items-center justify-between px-4 md:px-8 py-4">
          <h1 className="text-lg md:text-xl font-bold">Vendor Panel</h1>

          <div className="flex items-center gap-3 text-sm">
            <button className="hover:text-gray-300">Profile</button>
            <button
              onClick={handleLogout}
              className="bg-blue-600 px-3 py-1 rounded-md hover:bg-blue-500"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 px-4 md:px-8 pb-3 text-sm overflow-x-auto">
          {["dashboard", "products", "orders"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`capitalize px-4 py-1 rounded-full whitespace-nowrap ${
                activeTab === tab
                  ? "bg-blue-600"
                  : "bg-gray-900 hover:bg-gray-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* 📊 Content */}
      <main className="p-4 md:p-8">
        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <>
            <h2 className="text-xl md:text-2xl font-semibold mb-6">Overview</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="p-4 md:p-6 bg-gray-900 rounded-2xl border border-gray-800">
                <p className="text-gray-400 text-sm">Revenue</p>
                <h3 className="text-xl md:text-2xl font-bold">
                  ${stats.revenue.toFixed(2)}
                </h3>
              </div>

              <div className="p-4 md:p-6 bg-gray-900 rounded-2xl border border-gray-800">
                <p className="text-gray-400 text-sm">Orders</p>
                <h3 className="text-xl md:text-2xl font-bold">
                  {stats.orders}
                </h3>
              </div>

              <div className="p-4 md:p-6 bg-gray-900 rounded-2xl border border-gray-800">
                <p className="text-gray-400 text-sm">Products</p>
                <h3 className="text-xl md:text-2xl font-bold">
                  {stats.products}
                </h3>
              </div>

              <div className="p-4 md:p-6 bg-gray-900 rounded-2xl border border-gray-800">
                <p className="text-gray-400 text-sm">Pending</p>
                <h3 className="text-xl md:text-2xl font-bold">5</h3>
              </div>
            </div>
          </>
        )}

        {/* PRODUCTS */}
        {activeTab === "products" && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-semibold">Products</h2>

              <Link
                to="/vendor/createProduct"
                className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 text-sm"
              >
                + Add Product
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {loadingProducts ? (
                <p>Loading products...</p>
              ) : products.length === 0 ? (
                <p>No products found</p>
              ) : (
                products.map((product) => (
                  <div
                    key={product._id}
                    className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden"
                  >
                    <div className="h-32 bg-gray-800">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-3">
                      <h3 className="text-sm font-medium">{product.title}</h3>

                      <p className="text-gray-400 text-xs">${product.price}</p>

                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleEdit(product._id)}
                          className="flex-1 text-xs bg-gray-800 py-1 rounded hover:bg-gray-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="flex-1 text-xs bg-red-600 py-1 rounded hover:bg-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* ORDERS */}
        {activeTab === "orders" && (
          <>
            <h2 className="text-xl md:text-2xl font-semibold mb-6">Orders</h2>

            <div className="overflow-x-auto border border-gray-800 rounded-2xl">
              <table className="min-w-[600px] w-full text-left text-sm md:text-base">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="p-3 md:p-4">Order ID</th>
                    <th className="p-3 md:p-4">Customer</th>
                    <th className="p-3 md:p-4">Status</th>
                    <th className="p-3 md:p-4">Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {loadingOrders ? (
                    <tr>
                      <td colSpan="4" className="p-4 text-center">
                        Loading orders...
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-4 text-center">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order._id} className="border-t border-gray-800">
                        <td className="p-3 md:p-4">#{order._id.slice(-6)}</td>
                        <td className="p-3 md:p-4">
                          {order.customer?.fullName || "N/A"}
                        </td>
                        <td
                          className={`p-3 md:p-4 ${order.status === "delivered" ? "text-green-400" : order.status === "pending" ? "text-yellow-400" : "text-red-400"}`}
                        >
                          {order.status}
                        </td>
                        <td className="p-3 md:p-4">
                          ${order.totalAmount?.toFixed(2) || "0.00"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
