import React, { useEffect, useState, useRef } from "react";
import { Menu } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const nav = useNavigate();
  const [data, setData] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    stock: "",
  });
  const token = localStorage.getItem("token");

  console.log(token);

  const slideRef = useRef(); // side menu reference
  const tl = useRef(); // timeline reference

  useEffect(() => {
    authenticateAdmin();
  }, []);

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
        nav("/adminpage");
      } else {
        nav("/login");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // ✅ Fixed GSAP setup
  useGSAP(() => {
    // Set initial position off-screen to the right
    gsap.set(slideRef.current, { x: "100%" });

    tl.current = gsap.timeline({ paused: true }).to(slideRef.current, {
      x: "0%", // slide in to normal position
      duration: 0.5,
      ease: "power3.out",
    });
  }, []);

  const handleSlide = () => {
    tl.current.play();
  };

  const removeSlide = () => {
    tl.current.reverse();
  };

  // ✅ Fetch products
  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/product", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const result = await res.json();
      if (result.success) setData(result.data);
      else console.log("No products found");
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Delete Product
  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/product/delete/${id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json", "auth-token": token },
        }
      );
      const result = await res.json();
      if (result.success) {
        alert("Product deleted successfully");
        fetchData();
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // ✅ Update Handlers
  const handleUpdateClick = (product) => {
    setSelectedProduct(product);
    setUpdateForm({
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description,
      stock: product.stock,
    });
    setShowUpdateModal(true);
  };

  const handleUpdateChange = (e) => {
    setUpdateForm({
      ...updateForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:3000/api/product/update/${selectedProduct._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          body: JSON.stringify(updateForm),
        }
      );
      const result = await res.json();
      if (result.success) {
        alert("Product updated successfully");
        setShowUpdateModal(false);
        fetchData();
      } else {
        alert("Failed to update product");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const closeModal = () => {
    setShowUpdateModal(false);
    setSelectedProduct(null);
  };

  return (
    <div className="w-screen min-h-screen bg-gray-100 p-6 relative overflow-x-hidden">
      {/* Hamburger menu */}
      <Menu
        className="fixed w-8 h-8 text-gray-700 top-16 right-6 cursor-pointer z-40 bg-white p-1 rounded-md shadow-md"
        onClick={handleSlide}
      />

      {/* Sliding Menu */}
      <div
        ref={slideRef}
        className="fixed top-0 right-0 w-80 h-full bg-white shadow-2xl flex flex-col z-50 p-6"
      >
        {/* Close Button */}
        <button
          onClick={removeSlide}
          className="self-end text-2xl font-bold text-gray-700 hover:text-gray-900 mb-8"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Admin Menu
        </h2>

        <div className="flex flex-col gap-6">
          <button
            onClick={() => nav("/dashboard")}
            className="text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors text-left p-3 rounded-lg hover:bg-gray-100"
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => nav("/addproduct")}
            className="text-lg font-medium text-gray-700 hover:text-green-600 transition-colors text-left p-3 rounded-lg hover:bg-gray-100"
          >
            ➕ Add Products
          </button>
          <button
            onClick={() => nav("/checkallusers")}
            className="text-lg font-medium text-gray-700 hover:text-purple-600 transition-colors text-left p-3 rounded-lg hover:bg-gray-100"
          >
            👥 Check Users
          </button>
          <button
            onClick={() => nav("/orders")}
            className="text-lg font-medium text-gray-700 hover:text-orange-600 transition-colors text-left p-3 rounded-lg hover:bg-gray-100"
          >
            📦 Orders
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              nav("/login");
            }}
            className="text-lg font-medium text-red-600 hover:text-red-700 transition-colors text-left p-3 rounded-lg hover:bg-red-50 mt-8"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto mt-[5%]">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center mt-4">
          Admin Dashboard
        </h1>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-blue-600 text-xl">📦</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Products
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {data.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-green-600 text-xl">🛒</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Stock</p>
                <p className="text-2xl font-bold text-gray-800">
                  {data.filter((item) => item.stock > 0).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <span className="text-yellow-600 text-xl">⚠️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-gray-800">
                  {
                    data.filter((item) => item.stock > 0 && item.stock <= 10)
                      .length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <span className="text-red-600 text-xl">❌</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Out of Stock
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {data.filter((item) => item.stock === 0).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {data && data.length > 0 ? (
            data.map((item, index) => (
              <div
                key={item._id}
                className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300"
              >
                {/* Product Image */}
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Product Details */}
                <div className="p-4 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-xl font-bold text-green-600 mb-2">
                      ${item.price}
                    </p>
                    <p
                      className={`text-sm font-medium mb-2 ${
                        item.stock > 10
                          ? "text-green-600"
                          : item.stock > 0
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      Stock: {item.stock}
                    </p>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex gap-3 mt-auto">
                    <button
                      className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                      onClick={() => handleUpdateClick(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-xl text-gray-600">No products found</p>
              <button
                onClick={() => nav("/addproduct")}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add Your First Product
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Update Product Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Update Product
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={updateForm.name}
                    onChange={handleUpdateChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={updateForm.price}
                    onChange={handleUpdateChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={updateForm.image}
                    onChange={handleUpdateChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={updateForm.description}
                    onChange={handleUpdateChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={updateForm.stock}
                    onChange={handleUpdateChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    min="0"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  >
                    Update Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
