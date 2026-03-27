import { useForm } from "react-hook-form";
import { useState, useRef } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import API from "@/api/axios.js";

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  price: z.coerce.number().min(1, "Price must be at least 1"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  category: z.string().min(2, "Category is required"),
  description: z.string().optional(),
  images: z
    .array(z.any())
    .min(1, "At least one image is required")
    .max(5, "Max 5 images allowed"),
});

export default function VendorCreateProduct() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { images: [] },
  });

  // 🔐 ENV
  const cloudName = "dfuk8zunf";
  const uploadPreset = "products_upload";

  // ☁️ Upload single image
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData,
    );

    return res.data.secure_url;
  };

  // ✅ Add Image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const newImage = {
      file,
      preview: URL.createObjectURL(file),
    };

    const updatedImages = [...images, newImage].slice(0, 5);

    setImages(updatedImages);
    setValue(
      "images",
      updatedImages.map((img) => img.file),
    );
  };

  // ❌ Remove Image
  const handleRemoveImage = (indexToRemove) => {
    const updatedImages = images.filter((_, i) => i !== indexToRemove);

    setImages(updatedImages);
    setValue(
      "images",
      updatedImages.map((img) => img.file),
    );
  };

  // 🚀 Submit (UPDATED)
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // ☁️ Upload all images first
      const imageUrls = await Promise.all(
        data.images.map((file) => uploadToCloudinary(file)),
      );

      const payload = {
        title: data.title,
        price: data.price,
        stock: data.stock,
        category: data.category,
        description: data.description,
        images: imageUrls,
        thumbnail: imageUrls[0], // ⭐ first image
      };

      console.log("FINAL PAYLOAD:", payload);

      // 🚀 Send to backend
      await API.post("/product", payload);

      alert("Product Created ✅");
    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center flex-col bg-black text-white px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Add New Product</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-3xl w-full bg-gray-900 p-6 md:p-8 rounded-2xl border border-gray-800"
      >
        {/* Title */}
        <input
          {...register("title")}
          placeholder="Product title"
          className="w-full mb-3 px-4 py-2 bg-black border border-gray-800 rounded-lg"
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        {/* IMAGE UI */}
        <div className="mb-4">
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {images.map((img, index) => (
              <div
                key={index}
                className="relative h-24 border rounded-xl overflow-hidden group"
              >
                <img src={img.preview} className="w-full h-full object-cover" />

                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-black/70 px-2 text-xs opacity-0 group-hover:opacity-100"
                >
                  ✕
                </button>

                {index === 0 && (
                  <div className="absolute bottom-1 left-1 bg-blue-600 text-xs px-2">
                    Thumbnail
                  </div>
                )}
              </div>
            ))}

            {images.length < 5 && (
              <div
                onClick={() => fileInputRef.current.click()}
                className="h-24 border-2 border-dashed flex justify-center items-center cursor-pointer"
              >
                +
              </div>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />

          {errors.images && (
            <p className="text-red-500">{errors.images.message}</p>
          )}
        </div>

        {/* Price + Stock */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <input type="number" {...register("price")} placeholder="Price" />
          <input type="number" {...register("stock")} placeholder="Stock" />
        </div>

        {/* Category */}
        <input {...register("category")} placeholder="Category" />

        {/* Description */}
        <textarea {...register("description")} placeholder="Description" />

        {/* Submit */}
        <button disabled={loading} className="w-full bg-blue-600 py-3 mt-4">
          {loading ? "Uploading..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}
