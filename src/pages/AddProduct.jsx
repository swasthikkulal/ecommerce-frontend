import React, { useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, X } from "lucide-react";
import config from "../config";
import axios from "axios";

const AddProduct = () => {
  const nav = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    authenticateAdmin();
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    category: "", // Added category field
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Categories data - same as in Home component
  const categories = [
    { id: "chocolate", name: "Chocolate", icon: "🍫" },
    { id: "sugarfree", name: "Sugar Free", icon: "🩺" },
    { id: "fruity", name: "Fruity", icon: "🍓" },
    { id: "vanilla", name: "Vanilla", icon: "🌱" },
    { id: "premium", name: "Premium", icon: "⭐" },
    { id: "other", name: "Other", icon: "🍦" },
  ];

  const authenticateAdmin = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/user/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });
      const data = await response.json();
      if (data.success) {
        nav("/addproduct");
      } else {
        nav("/login");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // GSAP Animations
  const containerRef = React.useRef();
  const formRef = React.useRef();

  useGSAP(
    () => {
      const tl = gsap.timeline();
      tl.from(containerRef.current, {
        duration: 0.8,
        opacity: 0,
        y: 50,
        ease: "power3.out",
      }).from(
        formRef.current.children,
        {
          duration: 0.6,
          y: 30,
          opacity: 0,
          stagger: 0.1,
          ease: "power2.out",
        },
        "-=0.4"
      );
    },
    { scope: containerRef }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        alert("Please select a valid image file (JPEG, PNG, WebP)");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setUploadProgress(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      alert("Please select an image for the product");
      return;
    }

    if (!formData.category) {
      alert("Please select a category for the product");
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    // GSAP loading animation
    gsap.to(".submit-btn", {
      scale: 0.95,
      duration: 0.2,
      ease: "power2.inOut",
    });

    try {
      // Prepare form data
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("stock", formData.stock);
      formDataToSend.append("category", formData.category); // Add category
      formDataToSend.append("image", imageFile);

      const response = await axios.post(
        `${config.API_BASE_URL}/product/add`,
        formDataToSend,
        {
          headers: {
            "auth-token": localStorage.getItem("token"),
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(progress);
            }
          },
        }
      );

      if (response.data.success) {
        // Success animation
        gsap.to(".success-message", {
          duration: 0.5,
          y: 0,
          opacity: 1,
          ease: "power2.out",
        });

        // Reset form
        setFormData({
          name: "",
          price: "",
          description: "",
          stock: "",
          category: "", // Reset category too
        });
        setImageFile(null);
        setImagePreview("");
        setUploadProgress(0);

        // Hide success message after 3 seconds
        setTimeout(() => {
          gsap.to(".success-message", {
            duration: 0.5,
            y: -20,
            opacity: 0,
            ease: "power2.in",
          });
        }, 3000);
      } else {
        throw new Error(response.data.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product: " + error.message);
    } finally {
      setIsSubmitting(false);
      gsap.to(".submit-btn", {
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 relative"
    >
      <div className="max-w-2xl mx-auto mt-[5%]">
        <ArrowLeft
          className="w-6 h-6 text-gray-700 absolute top-[8%] left-[5%] cursor-pointer hover:text-blue-600 transition"
          onClick={() => nav("/adminpage")}
        />

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Add New Product
          </h1>
          <p className="text-gray-600">
            Fill in the details below to add a new product to your store
          </p>
        </div>

        {/* Success Message */}
        <div className="success-message opacity-0 transform -translate-y-5 mb-6">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            Product added successfully!
          </div>
        </div>

        {/* Form */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          {/* Product Name */}
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Enter product name"
              required
            />
          </div>

          {/* Price */}
          <div className="mb-6">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Price *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">₹</span>
              </div>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="mb-6">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Product Image *
            </label>

            {/* File Input */}
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="image"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-500" />
                  <p className="mb-1 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, WEBP (MAX. 5MB)
                  </p>
                </div>
                <input
                  id="image"
                  name="image"
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">
                    Image Preview:
                  </p>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                  />
                  <div className="mt-2 text-xs text-gray-500">
                    {imageFile?.name}
                  </div>
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {isSubmitting && uploadProgress > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Enter product description..."
              required
            />
          </div>

          {/* Stock */}
          <div className="mb-8">
            <label
              htmlFor="stock"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Stock Quantity *
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Enter stock quantity"
              min="0"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !imageFile || !formData.category}
            className="submit-btn w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {uploadProgress > 0
                  ? `Uploading... ${uploadProgress}%`
                  : "Adding Product..."}
              </div>
            ) : (
              "Add Product"
            )}
          </button>
        </form>

        {/* Form Guidelines */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-blue-800 mb-3">Form Guidelines</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• All fields marked with * are required</li>
            <li>• Price should be in INR format</li>
            <li>• Select the appropriate category for better filtering</li>
            <li>• Image should be in JPEG, PNG, or WEBP format (max 5MB)</li>
            <li>• Stock quantity cannot be negative</li>
            <li>• Supported image formats: JPG, JPEG, PNG, WEBP</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
