import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // vendor user
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    itemPrice: Number,
    taxAmount: { type: Number, default: 0 },
    shippingCost: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model("Order", orderSchema);
