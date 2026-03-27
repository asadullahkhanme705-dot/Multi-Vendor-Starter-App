import express from "express";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ✅ Add to cart
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    let cart = await Cart.findOne({ customer: req.user.id });

    // 🟢 create cart if not exists
    if (!cart) {
      cart = new Cart({
        customer: req.user.id,
        items: [],
      });
    }

    // 🟡 check if item already exists
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (itemIndex > -1) {
      // update quantity
      cart.items[itemIndex].quantity += quantity || 1;
    } else {
      // add new item
      cart.items.push({
        product: productId,
        quantity: quantity || 1,
      });
    }

    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// ✅ Get user cart
router.get("/", authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ customer: req.user.id }).populate(
      "items.product",
    );

    res.json(cart);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// ✅ Remove item from cart
router.post("/remove", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.body;

    const cart = await Cart.findOneAndUpdate(
      { customer: req.user.id },
      { $pull: { items: { product: productId } } },
      { new: true },
    ).populate("items.product");

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Update item quantity in cart
router.post("/update-quantity", authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const cart = await Cart.findOneAndUpdate(
      { customer: req.user.id, "items.product": productId },
      { $set: { "items.$.quantity": quantity } },
      { new: true },
    ).populate("items.product");

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
