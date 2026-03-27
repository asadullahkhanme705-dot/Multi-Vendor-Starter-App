import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import productRouter from "./routes/product.route.js";
import orderRouter from "./routes/order.route.js";
import cartRouter from "./routes/cart.route.js";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
dotenv.config();
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use("/auth", authRouter);
app.use("/product", productRouter);
app.use("/order", orderRouter);
app.use("/cart", cartRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV === "development" && { error: err }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
    app.listen(port, () => {
      console.log("Server started on port", port);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }
}

startServer();
