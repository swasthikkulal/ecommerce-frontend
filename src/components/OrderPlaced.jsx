import React, { useEffect, useState } from "react";
import config from "../config";
import { useNavigate } from "react-router-dom";

const OrderPlaced = () => {
  const nav = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      nav("/login");
    }
  }, [nav, token]);

  const fetchdata = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${config.API_BASE_URL}/checkout/getuserorder`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        }
      );
      const result = await response.json();
      console.log("API Response:", result);

      if (result.success) {
        setData(result.data || []);
      } else {
        alert("No data found");
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Error fetching orders");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchdata();
    }
  }, [token]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mt-[10%]">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Your Orders
        </h1>

        {!data || data.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No orders yet
              </h3>
              <p className="text-gray-500 mb-6">
                You haven't placed any orders. Start shopping to see your orders
                here!
              </p>
              <button
                onClick={() => nav("/")}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {data.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #
                        {order.orderNumber ||
                          order._id?.slice(-8).toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Placed on{" "}
                        {new Date(
                          order.createdAt?.$date || order.createdAt
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                      {order.status && (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      )}
                      {order.paymentStatus && (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                            order.paymentStatus
                          )}`}
                        >
                          Payment: {order.paymentStatus}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">
                    Order Items ({order.products?.length || 0})
                  </h4>

                  <div className="space-y-4">
                    {order.products?.map((item, index) => (
                      <div
                        key={item._id || index}
                        className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                      >
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={
                              item.image ||
                              "https://via.placeholder.com/80x80?text=No+Image"
                            }
                            alt={item.name}
                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-gray-200"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/80x80?text=No+Image";
                            }}
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h5 className="text-lg font-semibold text-gray-900 truncate">
                            {item.name || "Product Name Not Available"}
                          </h5>
                          <p className="text-sm text-gray-600 mt-1">
                            Quantity:{" "}
                            <span className="font-medium">
                              {item.quantity || 1}
                            </span>
                          </p>
                          <p className="text-sm text-gray-600">
                            Price:{" "}
                            <span className="font-medium">
                              ₹{item.price || "N/A"}
                            </span>
                          </p>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            ₹
                            {((item.price || 0) * (item.quantity || 1)).toFixed(
                              2
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      {order.shippingAddress && (
                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            Shipping Address:
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.shippingAddress.fullName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.shippingAddress.phone}
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.shippingAddress.addressLine1}
                            {order.shippingAddress.addressLine2 &&
                              `, ${order.shippingAddress.addressLine2}`}
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.shippingAddress.city},{" "}
                            {order.shippingAddress.state} -{" "}
                            {order.shippingAddress.pincode}
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.shippingAddress.country}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="text-right mt-3 sm:mt-0">
                      <div className="space-y-1">
                        {order.orderSummary?.subtotal && (
                          <p className="text-sm text-gray-600">
                            Subtotal:{" "}
                            <span className="font-medium">
                              ₹{order.orderSummary.subtotal.toFixed(2)}
                            </span>
                          </p>
                        )}
                        {order.orderSummary?.shipping !== undefined && (
                          <p className="text-sm text-gray-600">
                            Shipping:{" "}
                            <span className="font-medium">
                              ₹{order.orderSummary.shipping.toFixed(2)}
                            </span>
                          </p>
                        )}
                        {order.orderSummary?.tax !== undefined && (
                          <p className="text-sm text-gray-600">
                            Tax:{" "}
                            <span className="font-medium">
                              ₹{order.orderSummary.tax.toFixed(2)}
                            </span>
                          </p>
                        )}
                        <p className="text-lg font-bold text-gray-900 border-t pt-2">
                          Total: ₹
                          {order.orderSummary?.total?.toFixed(2) || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {data && data.length > 0 && (
        <div className="flex justify-center mt-8">
          <button
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            onClick={() => nav("/")}
          >
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderPlaced;
