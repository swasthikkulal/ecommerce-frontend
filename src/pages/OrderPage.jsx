import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

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
        navigate("/orderpage");
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  // Fetch orders data
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/checkout/getorder",
          {
            method: "GET",
            headers: {
              "auth-token": token,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Orders data:", data);
          setOrders(data.data || []);
        } else {
          console.log("Failed to fetch orders");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status with default value
  const getOrderStatus = (order) => {
    return order.status || "pending_payment"; // Default status
  };

  // Get status color
  const getStatusColor = (status) => {
    const orderStatus = status || "pending_payment";
    switch (orderStatus) {
      case "pending_payment":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-purple-100 text-purple-800";
      case "shipped":
        return "bg-indigo-100 text-indigo-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format status text with safe handling
  const formatStatus = (status) => {
    if (!status) return "Pending Payment"; // Default status text

    try {
      return status
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    } catch (error) {
      console.error("Error formatting status:", error, "Status:", status);
      return "Pending Payment"; // Fallback
    }
  };

  // Filter orders based on status and search
  const filteredOrders = orders.filter((order) => {
    const orderStatus = getOrderStatus(order);
    const matchesStatus =
      filterStatus === "all" || orderStatus === filterStatus;
    const matchesSearch =
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress?.fullName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const closeModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  // Calculate statistics with safe access
  const stats = {
    total: orders.length,
    pending: orders.filter(
      (order) => getOrderStatus(order) === "pending_payment"
    ).length,
    confirmed: orders.filter((order) => getOrderStatus(order) === "confirmed")
      .length,
    delivered: orders.filter((order) => getOrderStatus(order) === "delivered")
      .length,
    totalRevenue: orders.reduce(
      (sum, order) => sum + (order.orderSummary?.total || 0),
      0
    ),
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-[10%]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Orders Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage and track all customer orders ({orders.length} total)
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className=" rounded-lg  p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-blue-600 text-xl">📦</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>

          {/* <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <span className="text-yellow-600 text-xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Pending Payment
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.pending}
                </p>
              </div>
            </div>
          </div> */}

          {/* <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-blue-600 text-xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.confirmed}
                </p>
              </div>
            </div>
          </div> */}

          {/* <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-green-600 text-xl">🚚</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.delivered}
                </p>
              </div>
            </div>
          </div> */}

          <div className=" rounded-lg  p-6 ]">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <span className="text-purple-600 text-xl">💰</span>
              </div>
              <div className="ml-6 ]">
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  ₹{stats.totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            {/* <div className="flex gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="pending_payment">Pending Payment</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div> */}

            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search by order number, customer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Orders ({filteredOrders.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th> */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => {
                    const orderStatus = getOrderStatus(order);
                    const statusColor = getStatusColor(orderStatus);
                    const statusText = formatStatus(orderStatus);

                    return (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {order.orderNumber || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.products?.length || 0} item
                              {order.products?.length !== 1 ? "s" : ""}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {order.user?.name || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.user?.email || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.shippingAddress?.phone || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-lg object-cover bg-gray-100"
                                src={
                                  order.products?.[0]?.image ||
                                  "/placeholder-image.jpg"
                                }
                                alt={order.products?.[0]?.name || "Product"}
                                onError={(e) => {
                                  e.target.src = "/placeholder-image.jpg";
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 line-clamp-1">
                                {order.products?.[0]?.name || "Unknown Product"}
                              </div>
                              <div className="text-sm text-gray-500">
                                +{(order.products?.length || 1) - 1} more item
                                {(order.products?.length || 1) - 1 !== 1
                                  ? "s"
                                  : ""}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            ₹{(order.orderSummary?.total || 0).toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            ₹
                            {(
                              order.orderSummary?.subtotal || 0
                            ).toLocaleString()}{" "}
                            + tax
                          </div>
                        </td>
                        {/* <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColor}`}
                          >
                            {statusText}
                          </span>
                        </td> */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.createdAt
                            ? formatDate(order.createdAt)
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleViewOrder(order)}
                            className="text-indigo-600 hover:text-indigo-900 mr-3 font-medium"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          No orders found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {searchTerm || filterStatus !== "all"
                            ? "Try adjusting your search or filter criteria."
                            : "No orders have been placed yet."}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details Modal */}
        {showOrderModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Order Details - {selectedOrder.orderNumber || "N/A"}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                {/* Order Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3">
                      Order Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order Date:</span>
                        <span className="font-medium">
                          {selectedOrder.createdAt
                            ? formatDate(selectedOrder.createdAt)
                            : "N/A"}
                        </span>
                      </div>
                      {/* <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            getOrderStatus(selectedOrder)
                          )}`}
                        >
                          {formatStatus(getOrderStatus(selectedOrder))}
                        </span>
                      </div> */}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Items:</span>
                        <span className="font-medium">
                          {selectedOrder.products?.length || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Customer:</span>
                        <span className="font-medium">
                          {selectedOrder.user?.name || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3">
                      Payment Summary
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">
                          ₹
                          {(
                            selectedOrder.orderSummary?.subtotal || 0
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping:</span>
                        <span className="font-medium">
                          ₹
                          {(
                            selectedOrder.orderSummary?.shipping || 0
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax (18%):</span>
                        <span className="font-medium">
                          ₹
                          {(
                            selectedOrder.orderSummary?.tax || 0
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-gray-800 font-semibold">
                          Total Amount:
                        </span>
                        <span className="text-green-600 font-bold text-lg">
                          ₹
                          {(
                            selectedOrder.orderSummary?.total || 0
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold mb-3">
                    Shipping Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {selectedOrder.shippingAddress?.fullName || "N/A"}
                      </p>
                      <p className="text-gray-600">
                        Phone: {selectedOrder.shippingAddress?.phone || "N/A"}
                      </p>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>
                        {selectedOrder.shippingAddress?.addressLine1 || "N/A"}
                      </p>
                      {selectedOrder.shippingAddress?.addressLine2 && (
                        <p>{selectedOrder.shippingAddress.addressLine2}</p>
                      )}
                      <p>
                        {selectedOrder.shippingAddress?.city || "N/A"},{" "}
                        {selectedOrder.shippingAddress?.state || "N/A"} -{" "}
                        {selectedOrder.shippingAddress?.pincode || "N/A"}
                      </p>
                      <p>{selectedOrder.shippingAddress?.country || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {/* Products List */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Order Items ({selectedOrder.products?.length || 0})
                  </h3>
                  <div className="space-y-4">
                    {selectedOrder.products?.map((product, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-4 bg-white border rounded-lg p-4"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                          onError={(e) => {
                            e.target.src = "/placeholder-image.jpg";
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {product.name || "Unknown Product"}
                          </h4>
                          <p className="text-gray-600 text-sm">
                            Quantity: {product.quantity || 0}
                          </p>
                          <p className="text-gray-500 text-sm">
                            Product ID: {product.productId || "N/A"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            ₹{product.price || 0}
                          </p>
                          <p className="text-gray-600">
                            Total: ₹
                            {(
                              (product.price || 0) * (product.quantity || 0)
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )) || <p className="text-gray-500">No products found</p>}
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                  <button
                    onClick={closeModal}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  {/* <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
                    Update Status
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
