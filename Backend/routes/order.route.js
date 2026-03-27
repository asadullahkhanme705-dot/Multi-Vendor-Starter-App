import { Router } from "express";
import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js"; // ✅ import cart
import Product from "../models/product.model.js"; // ✅ import product
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

// ✅ Manual order creation (already exists)
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items are required" });
    }

    for (const item of items) {
      if (!item.product || !item.vendor) {
        return res.status(400).json({
          message: "Each item must have product and vendor",
        });
      }
    }

    const order = new Order({
      customer: req.user.id,
      items,
    });

    const savedOrder = await order.save();

    return res.status(201).json({
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// ✅ NEW: Create order from cart (USED BY YOUR FRONTEND)
router.post("/create-from-cart", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // 1️⃣ Get user's cart
    const cart = await Cart.findOne({ customer: userId }).populate(
      "items.product",
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    // 2️⃣ Calculate totals
    const itemPrice = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
    const taxAmount = itemPrice * 0.1; // 10% tax
    const shippingCost = 5.99; // fixed shipping
    const totalAmount = itemPrice + taxAmount + shippingCost;

    // 3️⃣ Convert cart → order items
    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      vendor: item.product.vendor, // ⚠️ make sure product has vendor field
      quantity: item.quantity,
    }));

    // 4️⃣ Create order
    const order = new Order({
      customer: userId,
      items: orderItems,
      totalAmount,
      itemPrice,
      taxAmount,
      shippingCost,
    });

    const savedOrder = await order.save();

    // 4️⃣ Clear cart
    cart.items = [];
    await cart.save();

    return res.status(201).json({
      message: "Order created from cart successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// ✅ Get vendor's orders (only their products)
router.get(
  "/my-vendor",
  authMiddleware,
  authorizeRoles("vendor"),
  async (req, res) => {
    try {
      const orders = await Order.find({ "items.vendor": req.user._id })
        .populate("items.product")
        .populate("customer");

      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
);

// ✅ Get my orders
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id })
      .populate("items.product")
      .populate("items.vendor");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
