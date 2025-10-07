import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PaymentButton from "../components/PaymentButton";
import config from "../config";
const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });
  const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);

  const [canCheckout, setCanCheckout] = useState(false);

  // Fetch cart items
  useEffect(() => {
    fetchCartItems();
    checkPaymentStatus();
  }, []);

  // Check payment status from localStorage
  const checkPaymentStatus = () => {
    const paymentStatus = localStorage.getItem("paymentCompleted");
    const successStatus = localStorage.getItem("success");

    console.log("Payment Status from localStorage:", paymentStatus);
    console.log("Success Status from localStorage:", successStatus);

    if (paymentStatus === "true" || successStatus === "true") {
      setIsPaymentCompleted(true);
      setCanCheckout(true);
    }
  };

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${config.API_BASE_URL}/orders/getorder`, {
        method: "GET",
        headers: {
          "auth-token": token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("API Response:", data);

        if (data.data && Array.isArray(data.data)) {
          const cartProducts = data.data.flatMap((order) =>
            order.status === "pending"
              ? order.products.map((item) => ({
                  ...item.productId,
                  quantity: item.quantity,
                  orderId: order._id,
                  cartItemId: item._id,
                  orderTotal: order.total,
                }))
              : []
          );

          console.log("Cart Products:", cartProducts);
          setCartItems(cartProducts);
        } else {
          console.log("No orders found or invalid data structure");
          setCartItems([]);
        }
      } else {
        console.log("API response not OK");
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle quantity increase (Frontend only)
  const handleIncreaseQuantity = (
    orderId,
    productId,
    currentQuantity,
    stock
  ) => {
    if (currentQuantity >= stock) {
      alert(`Cannot add more than available stock (${stock})`);
      return;
    }

    // Update local state only
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.orderId === orderId && item._id === productId
          ? { ...item, quantity: currentQuantity + 1 }
          : item
      )
    );
  };

  // Handle quantity decrease (Frontend only)
  const handleDecreaseQuantity = (orderId, productId, currentQuantity) => {
    if (currentQuantity <= 1) {
      // If quantity is 1, remove the item instead
      handleDelete(orderId, productId);
      return;
    }

    // Update local state only
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.orderId === orderId && item._id === productId
          ? { ...item, quantity: currentQuantity - 1 }
          : item
      )
    );
  };

  // Handle direct quantity input (Frontend only)
  const handleQuantityChange = (orderId, productId, newQuantity, stock) => {
    if (newQuantity === "" || newQuantity < 1) {
      return;
    }

    if (newQuantity > stock) {
      alert(`Cannot add more than available stock (${stock})`);
      return;
    }

    // Update local state only
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.orderId === orderId && item._id === productId
          ? { ...item, quantity: parseInt(newQuantity) }
          : item
      )
    );
  };

  // Handle payment completion from PaymentButton
  const handlePaymentSuccess = () => {
    console.log("Payment success callback triggered");
    setIsPaymentCompleted(true);
    setIsProcessingPayment(false);
    setCanCheckout(true);

    // Set multiple flags to ensure checkout works
    localStorage.setItem("paymentCompleted", "true");
    localStorage.setItem("success", "true");

    console.log("Payment completed, checkout should be enabled now");
  };

  const handlePaymentProcessing = () => {
    console.log("Payment processing started");
    setIsProcessingPayment(true);
    setCanCheckout(false);
  };

  const handlePaymentError = () => {
    console.log("Payment error occurred");
    setIsProcessingPayment(false);
    setIsPaymentCompleted(false);
    setCanCheckout(false);
    localStorage.setItem("paymentCompleted", "false");
    localStorage.setItem("success", "false");
  };

  // Handle delete item from cart
  const handleDelete = async (orderId, productId) => {
    console.log("Deleting item - Order ID:", orderId, "Product ID:", productId);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${config.API_BASE_URL}/orders/remove-item/${orderId}/${productId}`,
        {
          method: "DELETE",
          headers: {
            "auth-token": token,
          },
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        console.log("Item removed successfully:", result);
        alert("Item removed from cart successfully!");
        fetchCartItems();
      } else {
        await handleDeleteOrder(orderId);
      }
    } catch (error) {
      console.error("Error removing item:", error);
      await handleDeleteOrder(orderId);
    }
  };

  // Fallback: Delete entire order
  const handleDeleteOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/orders/delete/${orderId}`,
        {
          method: "DELETE",
          headers: {
            "auth-token": token,
          },
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        console.log("Order deleted successfully:", result);
        alert("Item removed from cart successfully!");
        fetchCartItems();
      } else {
        alert(`Failed to remove item: ${result.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Network error. Please try again.");
    }
  };

  // Calculate totals based on current quantities
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 500 ? 0 : 40;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  // Calculate item totals for display
  const getItemTotal = (price, quantity) => {
    return (price * quantity).toFixed(2);
  };

  // Store total in localStorage
  useEffect(() => {
    localStorage.setItem("total", total.toString());
  }, [total]);

  // Handle address change
  const handleAddressChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  // POST Checkout - Create New Order
  const handleCheckout = async () => {
    // Double check if checkout should be allowed

    try {
      const token = localStorage.getItem("token");

      const checkoutData = {
        address: address,
        cartItems: cartItems.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity, // This will use the updated frontend quantity
          image: item.image,
        })),
        total: total,
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
      };

      console.log("Sending POST checkout data:", checkoutData);

      const response = await fetch(`${config.API_BASE_URL}/checkout/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify(checkoutData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log("New order created successfully:", result);
        alert("Address created successfully.");

        // Clear localStorage flags
        localStorage.removeItem("paymentCompleted");
        localStorage.removeItem("success");
        localStorage.setItem("currentOrderId", result.data._id);

        // // Redirect to order confirmation page
        // window.location.href = "/orderplaced";
      } else {
        alert(`Checkout failed: ${result.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Network error during checkout. Please try again.");
    }
  };

  // Debug: Log state changes

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 text-gray-400">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Add some delicious ice creams to your cart!
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-[5%]">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          {/* Cart Items Section */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Cart Items ({cartItems.length})
                </h2>
              </div>

              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div
                    key={`${item.orderId}-${item._id}`}
                    className="p-6 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <img
                        src={`http://localhost:3000${item.image}`}
                        alt={item.name}
                        className="flex-none w-20 h-20 rounded-lg object-cover bg-gray-100"
                      />

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {item.name}
                        </h3>
                        <p className="text-lg font-semibold text-indigo-600 mt-1">
                          ₹{item.price} per kg
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 mt-3">
                          <span className="text-sm text-gray-700 font-medium">
                            Quantity:
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                handleDecreaseQuantity(
                                  item.orderId,
                                  item._id,
                                  item.quantity
                                )
                              }
                              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>

                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                handleQuantityChange(
                                  item.orderId,
                                  item._id,
                                  e.target.value,
                                  item.stock
                                )
                              }
                              className="w-16 h-8 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              min="1"
                              max={item.stock}
                            />

                            <button
                              onClick={() =>
                                handleIncreaseQuantity(
                                  item.orderId,
                                  item._id,
                                  item.quantity,
                                  item.stock
                                )
                              }
                              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={item.quantity >= item.stock}
                            >
                              +
                            </button>
                          </div>

                          <span className="text-sm text-gray-500">
                            Max: {item.stock} kg
                          </span>
                        </div>

                        <p className="text-sm text-gray-500 mt-2">
                          Stock: {item.stock} kg available
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-3">
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">
                          ₹{getItemTotal(item.price, item.quantity)}
                        </div>
                        <div className="text-sm text-gray-500">
                          ₹{item.price} × {item.quantity} kg
                        </div>
                      </div>

                      <button
                        onClick={() => handleDelete(item.orderId, item._id)}
                        className="text-red-600 hover:text-red-700 p-2 transition duration-200"
                        title="Remove from cart"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    Cart Total (
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                    items)
                  </span>
                  <span className="text-xl font-bold text-indigo-600">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary & Address Section */}
          <div className="mt-8 lg:mt-0 lg:col-span-5 relative">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-8">
              {/* Delivery Address */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Delivery Address
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={address.fullName}
                        onChange={handleAddressChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={address.phone}
                        onChange={handleAddressChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      name="addressLine1"
                      value={address.addressLine1}
                      onChange={handleAddressChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Street address, P.O. box, company name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      name="addressLine2"
                      value={address.addressLine2}
                      onChange={handleAddressChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Apartment, suite, unit, building, floor, etc."
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={address.city}
                        onChange={handleAddressChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={address.state}
                        onChange={handleAddressChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={address.pincode}
                        onChange={handleAddressChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="PIN Code"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="p-6 pt-[10%]">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Subtotal (
                      {cartItems.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                      items)
                    </span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (18% GST)</span>
                    <span className="font-medium">₹{tax.toFixed(2)}</span>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total Amount</span>
                      <span className="text-indigo-600">
                        ₹{total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {subtotal < 500 && (
                    <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                      Add ₹{(500 - subtotal).toFixed(2)} more for free shipping!
                    </div>
                  )}
                </div>

                {/* Payment Status Indicator */}

                <div className="mt-6 space-y-3">
                  <PaymentButton
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentProcessing={handlePaymentProcessing}
                    onPaymentError={handlePaymentError}
                  />

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    className="absolute w-[90%] py-3 px-4 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-200 bg-blue-500 top-[50%] left-[5%] "
                  >
                    Update the address
                  </button>

                  <Link
                    to="/products"
                    className="w-full bg-white text-indigo-600 border border-indigo-600 py-3 px-4 rounded-lg font-semibold hover:bg-indigo-50 flex items-center justify-center transition duration-200"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
