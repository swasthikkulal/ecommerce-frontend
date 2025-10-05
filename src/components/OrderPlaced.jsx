import React, { useEffect, useState } from "react";

const OrderPlaced = () => {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      nav("/login");
    }
  }, []);

  const fetchdata = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/orders/getorder",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        }
      );
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      } else {
        alert("No data found");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Error fetching orders");
    }
  };

  useEffect(() => {
    fetchdata();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mt-[10%]">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Your Orders
        </h1>

        {data && data.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No orders found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100"
              >
                {/* Order Status Badge */}
                <div
                  className={`px-4 py-3 border-b ${getStatusColor(
                    order.status
                  )}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold capitalize">
                      {order.status}
                    </span>
                    <span className="text-xs opacity-75">
                      #{order._id.slice(-6)}
                    </span>
                  </div>
                </div>

                {/* Products */}
                <div className="p-4">
                  {order.products &&
                    order.products.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center space-x-4 mb-4 last:mb-0"
                      >
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={
                              item.productId?.image || "/api/placeholder/80/80"
                            }
                            alt={item.productId?.name}
                            className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/80x80?text=No+Image";
                            }}
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {item.productId?.name}
                          </h3>
                          {/* <p className="text-sm text-gray-500 mt-1">
                            Quantity:{" "}
                            <span className="font-medium text-gray-700">
                              {item.quantity}
                            </span>
                          </p> */}
                        </div>
                      </div>
                    ))}
                </div>

                {/* Order Date */}
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Ordered on{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPlaced;
