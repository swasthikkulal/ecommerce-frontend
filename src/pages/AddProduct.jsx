import React, { useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const nav = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    authenticateAdmin();
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    stock: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const authenticateAdmin = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/user/users", {
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
      // Form entrance animation
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // GSAP loading animation
    gsap.to(".submit-btn", {
      scale: 0.95,
      duration: 0.2,
      ease: "power2.inOut",
    });

    try {
      // Simulate API call
      const response = await fetch("http://localhost:3000/api/product/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
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
          image: "",
          description: "",
          stock: "",
        });

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
        throw new Error(result.message || "Failed to add product");
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
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4"
    >
      <div className="max-w-2xl mx-auto mt-[5%]">
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
                <span className="text-gray-500">$</span>
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

          {/* Image URL */}
          <div className="mb-6">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Image URL *
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="https://example.com/image.jpg"
              required
            />
            {formData.image && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
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
            disabled={isSubmitting}
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
                Adding Product...
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
            <li>• Price should be in USD format</li>
            <li>• Image URL should be a direct link to the product image</li>
            <li>• Stock quantity cannot be negative</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
