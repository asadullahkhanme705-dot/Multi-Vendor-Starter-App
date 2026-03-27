import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 1,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    images: [
      {
        type: String, // Cloudinary URLs
        required: true,
      },
    ],

    thumbnail: {
      type: String, // first image
      required: true,
    },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // assuming you have users
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);