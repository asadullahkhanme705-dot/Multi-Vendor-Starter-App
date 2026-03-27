import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function CustomerDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [cart, setCart] = useState(null);
  const [showCart, setShowCart] = useState(false);

  const [loadingAction, setLoadingAction] = useState(null);

  // ✅ Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/product/all");
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ✅ Fetch cart
  const fetchCart = async () => {
    try {
      const res = await API.get("/cart");
      setCart(res.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  // ✅ Add to Cart
  const handleAddToCart = async (product) => {
    try {
      setLoadingAction(product._id);

      await API.post("/cart/add", {
        productId: product._id,
        quantity: 1,
      });

      alert("Added to cart 🛒");
      fetchCart(); // Refresh cart
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Failed to add ❌");
    } finally {
      setLoadingAction(null);
    }
  };

  // ✅ Remove from Cart
  const handleRemoveFromCart = async (productId) => {
    try {
      await API.post("/cart/remove", { productId });
      fetchCart();
    } catch (error) {
      console.error("Error removing from cart:", error);
      alert("Failed to remove ❌");
    }
  };

  // ✅ Update quantity
  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await API.post("/cart/update-quantity", {
        productId,
        quantity: newQuantity,
      });
      fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Failed to update ❌");
    }
  };

  // ✅ Show cart
  const handleShowCart = async () => {
    await fetchCart();
    setShowCart(true);
    setShowOrders(false);
  };

  // ✅ Checkout
  const handleCheckout = async () => {
    try {
      await API.post("/order/create-from-cart");

      alert("Order placed successfully ✅");

      setShowCart(false);
      fetchOrders();
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Checkout failed ❌");
    }
  };

  // ✅ Fetch Orders
  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);

      const res = await API.get("/order/my");

      setOrders(res.data);
      setShowOrders(true);
      setShowCart(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 🔝 Navbar */}
      <header className="sticky top-0 z-50 bg-black border-b border-gray-800">
        <div className="flex items-center justify-between px-4 py-3 gap-3">
          <h1 className="text-lg md:text-xl font-bold">MyStore</h1>

          <div className="flex-1 max-w-2xl">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-800"
            />
          </div>

          <div className="flex items-center gap-3 text-sm">
            <button onClick={fetchOrders}>Orders</button>
            <button onClick={handleShowCart}>Cart 🛒</button>
          </div>
        </div>
      </header>

      {/* 🛍️ Orders */}
      {showOrders && (
        <section className="px-4 md:px-8 py-6">
          <h3 className="text-xl font-semibold mb-4">My Orders</h3>

          {loadingOrders ? (
            <p>Loading...</p>
          ) : orders.length === 0 ? (
            <p>No orders</p>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="bg-gray-900 p-4 mb-3 rounded">
                <p className="text-sm text-gray-400 mb-2">
                  Order #{order._id} -{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between py-2">
                    <span>{item.product?.title}</span>
                    <span>
                      Qty: {item.quantity} - $
                      {(item.product?.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="border-t border-gray-700 mt-2 pt-2">
                  <p className="text-right font-semibold">
                    Total: ${order.totalAmount?.toFixed(2) || "N/A"}
                  </p>
                  <p className="text-right text-sm text-gray-400">
                    Status: {order.status}
                  </p>
                </div>
              </div>
            ))
          )}
        </section>
      )}

      {/* 🛒 Cart */}
      {showCart && cart && (
        <section className="px-4 md:px-8 py-6">
          <h3 className="text-xl font-semibold mb-4">My Cart</h3>

          {cart.items.length === 0 ? (
            <p>Cart is empty</p>
          ) : (
            <>
              <div className="space-y-3">
                {cart.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center bg-gray-900 p-3 rounded"
                  >
                    <div>
                      <span>{item.product?.title}</span>
                      <span className="ml-4">${item.product?.price}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(
                            item.product._id,
                            item.quantity - 1,
                          )
                        }
                      >
                        -
                      </button>
                      <span>Qty: {item.quantity}</span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(
                            item.product._id,
                            item.quantity + 1,
                          )
                        }
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleRemoveFromCart(item.product._id)}
                        className="text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-right">
                <p className="text-lg font-semibold">
                  Total: $
                  {cart.items
                    .reduce(
                      (sum, item) => sum + item.product?.price * item.quantity,
                      0,
                    )
                    .toFixed(2)}
                </p>
              </div>

              <button
                onClick={handleCheckout}
                className="mt-6 w-full bg-green-600 py-2 rounded"
              >
                Checkout ✅
              </button>
            </>
          )}
        </section>
      )}

      {/* 🛍️ Products */}
      {!showOrders && !showCart && (
        <main className="px-4 md:px-8 py-6">
          <h3 className="text-xl font-semibold mb-4">Products</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {loading ? (
              <p>Loading...</p>
            ) : (
              products.map((product) => (
                <div key={product._id} className="bg-gray-900 p-3 rounded">
                  <img
                    src={product.thumbnail}
                    className="h-32 w-full object-cover rounded"
                  />

                  <h4 className="mt-2">{product.title}</h4>
                  <p className="text-sm text-gray-400">${product.price}</p>

                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={loadingAction === product._id}
                    className="mt-2 w-full bg-blue-600 py-1 rounded"
                  >
                    {loadingAction === product._id
                      ? "Adding..."
                      : "Add to Cart"}
                  </button>
                </div>
              ))
            )}
          </div>
        </main>
      )}
    </div>
  );
}
