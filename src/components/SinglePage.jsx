import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function SingleViewPage() {
  const nav = useNavigate();
  const [getbyId, setgetbyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();
  const [allIcecream, setallIcecream] = useState([]);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://13.60.68.11:3000/api";

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/product`)
      .then((res) => {
        setallIcecream(res.data.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      nav("/login");
    }
  }, [nav]);

  const fetchIcecream = () => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/product/${id}`)
      .then((res) => {
        setgetbyId(res.data.data);
      })
      .catch((error) => {
        console.log(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchIcecream();
  }, [id]);

  // Calculate total price
  const totalPrice = getbyId ? (getbyId.price * quantity).toFixed(2) : 0;

  // Handle quantity changes
  const incrementQuantity = () => {
    if (getbyId && quantity < getbyId.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= (getbyId?.stock || 1)) {
      setQuantity(value);
    }
  };

  // Handle Add to Cart
  const handleAddToCart = async () => {
    try {
      let token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to add items to cart");
        return;
      }

      if (!getbyId) {
        alert("Product information not available");
        return;
      }

      const orderData = {
        products: [
          {
            productId: getbyId._id,
            name: getbyId.name,
            price: getbyId.price,
            image: getbyId.image,
            quantity: quantity,
          },
        ],
        total: totalPrice,
        status: "cart",
      };

      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`${quantity} kg of ${getbyId.name} added to cart!`);
        nav("/cartpage");
      } else {
        toast.error(
          `❌ Failed to add to cart: ${result.message || "Unknown error"}`,
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );

  if (!getbyId)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-2xl text-gray-600">Product not found</p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8 mt-[5%]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {/* Breadcrumb */}
            <nav className="mb-6">
              <ol className="flex items-center space-x-2 text-sm text-gray-500">
                <li>
                  <button
                    onClick={() => nav("/")}
                    className="hover:text-indigo-600 transition-colors"
                  >
                    Home
                  </button>
                </li>
                <li>/</li>
                <li>
                  <button
                    onClick={() => nav("/")}
                    className="hover:text-indigo-600 transition-colors"
                  >
                    Products
                  </button>
                </li>
                <li>/</li>
                <li className="text-indigo-600 font-semibold">
                  {getbyId.name}
                </li>
              </ol>
            </nav>

            {/* Product Image */}
            <div className="flex justify-center">
              <img
                src={getbyId.image}
                alt={getbyId.name}
                className="w-full max-w-md h-80 object-cover rounded-xl shadow-md"
                onError={(e) => {
                  e.target.src = "/placeholder-image.jpg";
                }}
              />
            </div>
          </div>

          {/* Product Details Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="space-y-6">
              {/* Product Name and Category */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {getbyId.name}
                </h1>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600 capitalize">
                    {getbyId.category?.name || "Ice Cream"}
                  </span>
                </div>
              </div>

              {/* Price Section */}
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-green-600">
                  ₹{getbyId.price}
                </span>
                <span className="text-lg text-gray-500">per kg</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  20% OFF
                </span>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-3">
                <label className="text-lg font-semibold text-gray-900">
                  Quantity (kg)
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                  >
                    -
                  </button>

                  <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    min="1"
                    max={getbyId.stock}
                    className="w-20 h-12 text-center border-2 border-indigo-500 rounded-lg font-semibold text-gray-900 text-lg"
                  />

                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= getbyId.stock}
                    className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                  >
                    +
                  </button>

                  <span className="text-gray-500 text-sm">
                    Max: {getbyId.stock} kg available
                  </span>
                </div>
              </div>

              {/* Total Price */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Amount:</span>
                  <span className="text-2xl font-bold">₹{totalPrice}</span>
                </div>
                <div className="text-green-100 text-sm mt-1 text-center">
                  {quantity} kg × ₹{getbyId.price} = ₹{totalPrice}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-semibold text-lg transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <span>ADD TO CART</span>
                  <span className="text-xl">+</span>
                </button>

                <button
                  onClick={() => window.history.back()}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition-colors"
                >
                  Continue Shopping
                </button>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div
                  className={`w-3 h-3 rounded-full ${
                    getbyId.stock > 10
                      ? "bg-green-500"
                      : getbyId.stock > 5
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                ></div>
                <span
                  className={`font-semibold ${
                    getbyId.stock > 10
                      ? "text-green-600"
                      : getbyId.stock > 5
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                >
                  {getbyId.stock} {getbyId.stock === 1 ? "kg" : "kgs"} available
                  •{" "}
                  {getbyId.stock > 10
                    ? "In Stock"
                    : getbyId.stock > 5
                      ? "Low Stock"
                      : "Almost Gone!"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Product Details
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            {getbyId.description}
          </p>
        </div>

        {/* Related Products Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">
            You Might Also Like
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {allIcecream
              .filter((item) => item._id !== getbyId._id) // Exclude current product
              .slice(0, 5) // Show only 5 related products
              .map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
                  onClick={() => nav(`/singleview/${item._id}`)}
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg";
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-1 mb-2">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-green-600 font-bold text-lg">
                        ₹{item.price}
                      </span>
                      <span className="text-gray-500 text-sm">per kg</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Stock: {item.stock}
                      </span>
                      <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                        View Details →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {allIcecream.filter((item) => item._id !== getbyId._id).length ===
            0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍦</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No related products found
              </h3>
              <p className="text-gray-500">
                Check back later for more delicious ice cream options!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
