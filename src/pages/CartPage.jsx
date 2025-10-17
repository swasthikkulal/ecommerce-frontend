import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import config from "../config";
import { toast } from "react-toastify";

const CartPage = () => {
  const navigate = useNavigate();
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
  const [hasSavedAddress, setHasSavedAddress] = useState(false);

  // Get user-specific storage key
  const getAddressKey = () => {
    const token = localStorage.getItem("token");
    let userIdentifier = "anonymous";

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        userIdentifier = payload.userId || payload.id || "unknown";
      } catch (error) {
        console.log("Could not extract user ID from token");
      }
    }

    return `userAddress_${userIdentifier}`;
  };

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 500 ? 0 : 40;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  // Store total in localStorage only when cart has items and total is valid
  useEffect(() => {
    if (cartItems.length > 0 && total > 0) {
      console.log("💰 Storing total in localStorage:", total.toFixed(2));
      localStorage.setItem("total", total.toFixed(2));
    }
  }, [cartItems, total]);

  // Fetch cart items and address
  useEffect(() => {
    fetchCartItems();
    loadSavedAddress();
  }, []);

  // Load saved address from localStorage with user-specific key
  const loadSavedAddress = () => {
    const addressKey = getAddressKey();
    const savedAddress = localStorage.getItem(addressKey);

    if (savedAddress) {
      try {
        const parsedAddress = JSON.parse(savedAddress);
        setAddress(parsedAddress);
        setHasSavedAddress(true);
      } catch (error) {
        console.error("Error parsing saved address:", error);
      }
    }
  };

  // Save address to localStorage with user-specific key
  const saveAddressToLocalStorage = (addressData) => {
    const addressKey = getAddressKey();
    localStorage.setItem(addressKey, JSON.stringify(addressData));
    setHasSavedAddress(true);
  };

  // Clear saved address for current user
  const clearSavedAddress = () => {
    const addressKey = getAddressKey();
    localStorage.removeItem(addressKey);
    setAddress({
      fullName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    });
    setHasSavedAddress(false);
  };

  // POST Checkout - Create New Order
  const handleCheckout = async () => {
    if (
      !address.fullName ||
      !address.phone ||
      !address.addressLine1 ||
      !address.city ||
      !address.state ||
      !address.pincode
    ) {
      alert("Please fill in all required address fields before checkout");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // Store the final total in localStorage right before checkout
      console.log("💰 Final total before checkout:", total.toFixed(2));
      localStorage.setItem("total", total.toFixed(2));

      // Verify it was stored correctly
      const storedTotal = localStorage.getItem("total");
      console.log("✅ Verified stored total:", storedTotal);

      const checkoutData = {
        address: address,
        cartItems: cartItems.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        total: parseFloat(total.toFixed(2)),
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
        toast.success("processing for payment!");

        // Save address for future use
        saveAddressToLocalStorage(address);

        // Clear cart and redirect to payment page
        setCartItems([]);

        // Navigate to payment page - the total is already stored in localStorage
        window.location.href = "/paymentpage";
      } else {
        alert(`Checkout failed: ${result.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Network error during checkout. Please try again.");
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
        console.log("Cart API Response:", data);

        if (data.data && Array.isArray(data.data)) {
          const cartProducts = data.data.flatMap((order) =>
            order.products
              ? order.products.map((item) => ({
                  ...item,
                  orderId: order._id,
                  _id: item.productId?._id || item._id,
                  name: item.productId?.name || item.name,
                  price: item.productId?.price || item.price,
                  image: item.productId?.image || item.image,
                  stock: item.productId?.stock || 10,
                  quantity: item.quantity || 1,
                }))
              : []
          );

          console.log("Processed Cart Products:", cartProducts);
          setCartItems(cartProducts.length > 0 ? cartProducts : []);
        } else {
          console.log("No orders found");
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

  // Handle quantity increase
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

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.orderId === orderId && item._id === productId
          ? { ...item, quantity: currentQuantity + 1 }
          : item
      )
    );
  };

  // Handle quantity decrease
  const handleDecreaseQuantity = (orderId, productId, currentQuantity) => {
    if (currentQuantity <= 1) {
      handleDelete(orderId, productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.orderId === orderId && item._id === productId
          ? { ...item, quantity: currentQuantity - 1 }
          : item
      )
    );
  };

  // Handle direct quantity input
  const handleQuantityChange = (orderId, productId, newQuantity, stock) => {
    if (newQuantity === "" || newQuantity < 1) {
      return;
    }

    if (newQuantity > stock) {
      alert(`Cannot add more than available stock (${stock})`);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.orderId === orderId && item._id === productId
          ? { ...item, quantity: parseInt(newQuantity) }
          : item
      )
    );
  };

  const getItemTotal = (price, quantity) => {
    return (price * quantity).toFixed(2);
  };

  // Handle address change
  const handleAddressChange = (e) => {
    const newAddress = {
      ...address,
      [e.target.name]: e.target.value,
    };
    setAddress(newAddress);
  };

  // Save address when user updates it
  const handleSaveAddress = () => {
    if (
      !address.fullName ||
      !address.phone ||
      !address.addressLine1 ||
      !address.city ||
      !address.state ||
      !address.pincode
    ) {
      alert("Please fill in all required address fields");
      return;
    }

    saveAddressToLocalStorage(address);
    alert(
      "Address saved successfully! It will be auto-filled for your future orders."
    );
  };

  // Handle delete item from cart
  const handleDelete = async (orderId, productId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${config.API_BASE_URL}/orders/delete/${orderId}`,
        {
          method: "DELETE",
          headers: {
            "auth-token": token,
          },
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success("Item removed from cart successfully!");
        fetchCartItems();
      } else {
        alert(`Failed to remove item: ${result.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Network error. Please try again.");
    }
  };

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
                    className="p-6 flex items-center space-x-4"
                  >
                    <img
                      src={item.image || "/placeholder-image.jpg"}
                      alt={item.name}
                      className="flex-none w-20 h-20 rounded-lg object-cover bg-gray-100"
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg";
                      }}
                    />

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900">
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
          <div className="mt-8 lg:mt-0 lg:col-span-5">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-8">
              {/* Delivery Address */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Delivery Address
                  </h2>
                  {hasSavedAddress && (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveAddress}
                        className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Update
                      </button>
                      <button
                        onClick={clearSavedAddress}
                        className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>

                {hasSavedAddress && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-700">
                      ✅ Using your saved address
                    </p>
                  </div>
                )}

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

                  {/* Save Address Button */}
                  {!hasSavedAddress && (
                    <button
                      onClick={handleSaveAddress}
                      className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition duration-200"
                    >
                      Save Address for Future Orders
                    </button>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="p-6">
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

                <div className="mt-6 space-y-3">
                  {/* Process Payment Button */}
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-600 flex items-center justify-center transition duration-200"
                  >
                    Process Payment - ₹{total.toFixed(2)}
                  </button>

                  <Link
                    to="/"
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
