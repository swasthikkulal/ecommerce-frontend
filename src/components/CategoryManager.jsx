// components/Admin/CategoryManager.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, MoveLeft } from "lucide-react";

const CategoryManager = () => {
  const token = localStorage.getItem("token");
  const nav = useNavigate();
  const config = {
    API_BASE_URL:
      import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  };

  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    displayOrder: 0,
    parentCategory: "",
    isActive: true,
  });

  useEffect(() => {
    authenticateAdmin();
  }, []);

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
        nav("/categorymanager");
      } else {
        nav("/login");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Use environment variable or default URL
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/categories`, {
        headers: {
          "auth-token": token,
        },
      });
      const result = await response.json();
      if (result.success) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  //   const handleCreateCategory = async (e) => {
  //     e.preventDefault();
  //     try {
  //       const token = localStorage.getItem("token");
  //       const response = await fetch(`${API_BASE_URL}/categories`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           "auth-token": token,
  //         },
  //         body: JSON.stringify(formData),
  //       });

  //       const result = await response.json();
  //       if (result.success) {
  //         setShowForm(false);
  //         setFormData({
  //           name: "",
  //           description: "",
  //           image: "",
  //           displayOrder: 0,
  //           parentCategory: "",
  //           isActive: true,
  //         });
  //         fetchCategories();
  //         alert("Category created successfully!");
  //       } else {
  //         alert(`Error: ${result.message}`);
  //       }
  //     } catch (error) {
  //       console.error("Error creating category:", error);
  //       alert("Error creating category");
  //     }
  //   };

  // components/Admin/CategoryManager.js
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      // Prepare data - convert empty string to null for parentCategory
      const categoryData = {
        ...formData,
        parentCategory: formData.parentCategory || null,
      };

      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify(categoryData),
      });

      const result = await response.json();
      if (result.success) {
        setShowForm(false);
        setFormData({
          name: "",
          description: "",
          image: "",
          displayOrder: 0,
          parentCategory: "",
          isActive: true,
        });
        fetchCategories();
        alert("Category created successfully!");
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error creating category:", error);
      alert("Error creating category");
    }
  };

  const handleUpdateCategory = async (categoryId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        setShowForm(false);
        setEditingCategory(null);
        setFormData({
          name: "",
          description: "",
          image: "",
          displayOrder: 0,
          parentCategory: "",
          isActive: true,
        });
        fetchCategories();
        alert("Category updated successfully!");
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Error updating category");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${API_BASE_URL}/categories/${categoryId}`,
          {
            method: "DELETE",
            headers: {
              "auth-token": token,
            },
          }
        );

        const result = await response.json();
        if (result.success) {
          fetchCategories();
          alert("Category deleted successfully!");
        } else {
          alert(`Error: ${result.message}`);
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Error deleting category");
      }
    }
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      image: category.image || "",
      displayOrder: category.displayOrder || 0,
      parentCategory: category.parentCategory || "",
      isActive: category.isActive,
    });
    setShowForm(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingCategory) {
      handleUpdateCategory(editingCategory._id);
    } else {
      handleCreateCategory(e);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData({
      name: "",
      description: "",
      image: "",
      displayOrder: 0,
      parentCategory: "",
      isActive: true,
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto mt-[10%] ">
      <ArrowLeft
        className="w-6 h-6 text-gray-700 absolute top-[8%] left-[5%] cursor-pointer"
        onClick={() => nav("/adminpage")}
      />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Category Management
        </h2>
        <button
          onClick={() => {
            setEditingCategory(null);
            setFormData({
              name: "",
              description: "",
              image: "",
              displayOrder: 0,
              parentCategory: "",
              isActive: true,
            });
            setShowForm(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Add New Category
        </button>
      </div>

      {/* Category Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingCategory ? "Edit Category" : "Create New Category"}
          </h3>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter category name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      displayOrder: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Display order"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter category description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter image URL"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Active Category
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                {editingCategory ? "Update Category" : "Create Category"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Display Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {category.image && (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-8 h-8 rounded-full mr-3 object-cover"
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {category.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {category.slug}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate">
                    {category.description || "No description"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {category.displayOrder}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      category.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {category.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEditClick(category)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {categories.length === 0 && !showForm && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No categories found. Create your first category!
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
