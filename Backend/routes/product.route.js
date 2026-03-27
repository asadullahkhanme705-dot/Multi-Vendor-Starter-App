import express from "express";
import Product from "../models/product.model.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

// 🔐 PROTECTED ROUTE
router.post(
  "/",
  authMiddleware,
  authorizeRoles("vendor", "admin"),
  async (req, res) => {
    try {
      const { title, price, stock, category, description, images, thumbnail } =
        req.body;

      const product = await Product.create({
        title,
        price,
        stock,
        category,
        description,
        images,
        thumbnail,
        vendor: req.user._id, // 🔥 from token
      });

      res.status(201).json({
        success: true,
        product,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
);

router.get("/vendor/all", authMiddleware, async (req, res) => {
  const vendorId = req.user.id;
  const products = await Product.find({ vendor: vendorId }).sort({
    createdAt: -1,
  });

  res.json(products);
});

router.get("/all", authMiddleware, async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });

  res.json(products);
});

// ✅ Edit product (vendor only)
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("vendor", "admin"),
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product)
        return res.status(404).json({ message: "Product not found" });

      if (product.vendor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
      );
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
);

// ✅ Delete product (vendor only)
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("vendor", "admin"),
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product)
        return res.status(404).json({ message: "Product not found" });

      if (product.vendor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized" });
      }

      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
);

export default router;
