import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { CloudHail } from "lucide-react";
import config from "../config";

export default function SingleViewPage() {
  const nav = useNavigate();
  const [getbyId, setgetbyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();

  const [allIcecream, setallIcecream] = useState();
  useEffect(() => {
    axios
      .get(`${config.API_BASE_URL}/product`)
      .then((res) => {
        setallIcecream(res.data.data);
        console.log(res.data.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token"); // ✅ Added "token" as argument
    if (!token) {
      nav("/login");
    }
  }, []);

  const fetchIcecream = () => {
    setLoading(true);
    axios
      .get(`${config.API_BASE_URL}/product/${id}`)
      .then((res) => {
        setgetbyId(res.data.data);
        console.log(res.data.data);
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
      console.log(token);
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
      const response = await fetch(`${config.API_BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      console.log(result);

      if (result.success) {
        alert(`✅ ${quantity} kg of ${getbyId.name} added to cart!`);
      } else {
        alert(`❌ Failed to add to cart: ${result.message || "Unknown error"}`);
      }
      nav("/cartpage");
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
    <div className="max-w-[100%] min-h-screen grid justify-center items-center py-8">
      <div className="md:grid md:grid-cols-2 max-w-7xl w-full items-center justify-center gap-10 mt-[3%]">
        {/* Product Image Section */}
        <div className="w-full grid items-center justify-center">
          <div className="px-4 pt-4 mb-4">
            <p className="flex text-gray-600">
              Icecream /{" "}
              <b className="text-red-500 font-semibold">{getbyId.name}</b>
            </p>
          </div>
          <div className="flex items-center justify-center p-4">
            <img
              src={`http://localhost:3000${getbyId.image}`}
              alt={getbyId.name}
              className="imageShadow max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Product Details Section */}
        <div className="w-full grid items-center justify-center">
          <div className="mt-4 grid items-center justify-center md:mx-0 mx-3">
            <div className="bg-green-600 w-full p-6 rounded-t-3xl rounded-lg shadow-lg">
              <p className="md:text-4xl text-2xl font-semibold text-white">
                {getbyId.name}
              </p>

              <div className="flex gap-2 md:mt-6 mt-4 items-center">
                <div className="w-5 border-2 border-emerald-900 h-5 rounded-sm flex items-center justify-center bg-white">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-900"></div>
                </div>
                <p className="text-white">Ice-Cream</p>
              </div>

              {/* Price and Discount */}
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <p className="md:text-2xl text-xl text-white font-semibold">
                  ₹{getbyId.price} / kg
                </p>
                <div className="px-3 py-1 border-2 border-blue-300 flex items-center justify-center rounded-full bg-blue-100">
                  <p className="text-blue-700 font-semibold text-sm">20% off</p>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mt-6">
                <p className="text-white font-semibold mb-2">Quantity (kg):</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-600 font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>

                  <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    min="1"
                    max={getbyId.stock}
                    className="w-20 h-10 text-center border-2 border-green-500 rounded-lg font-semibold text-green-700"
                  />

                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= getbyId.stock}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-600 font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>

                  <span className="text-white text-sm">
                    Max: {getbyId.stock} kg
                  </span>
                </div>
              </div>

              {/* Total Price */}
              <div className="mt-4 p-3 bg-green-700 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">Total:</span>
                  <span className="text-white text-2xl font-bold">
                    ₹{totalPrice}
                  </span>
                </div>
                <div className="text-green-200 text-sm mt-1">
                  {quantity} kg × ₹{getbyId.price} = ₹{totalPrice}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-4 flex-wrap">
                <button
                  onClick={handleAddToCart}
                  className="w-48 h-12 bg-orange-300 rounded-full flex items-center justify-center text-sm gap-1 cursor-pointer hover:bg-orange-400 transition-colors font-semibold"
                >
                  <span>ADD TO CART</span>
                  <span className="mt-[-0.5rem]">+</span>
                </button>
              </div>

              <div className="mt-3">
                <p className="text-green-200 text-xs">Customisable</p>
              </div>
            </div>

            {/* Additional Details */}
            <div className="border border-black/5 bg-neutral-800/5 w-full p-6 rounded-b-lg shadow-lg">
              <div className="mt-4">
                <p className="md:text-2xl text-xl font-semibold text-gray-800">
                  Details of Icecream
                </p>
                <p className="md:text-base text-sm text-gray-600 mt-2 leading-relaxed">
                  {getbyId.description}
                </p>
              </div>

              <div className="mt-6">
                <p className="md:text-2xl text-xl font-semibold text-gray-800">
                  Stock Availability
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      getbyId.stock > 10
                        ? "bg-green-500"
                        : getbyId.stock > 5
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  ></div>
                  <p
                    className={`md:text-base text-sm font-semibold ${
                      getbyId.stock > 10
                        ? "text-green-600"
                        : getbyId.stock > 5
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {getbyId.stock} {getbyId.stock === 1 ? "kg" : "kgs"} left -{" "}
                    {getbyId.stock > 10
                      ? "In Stock"
                      : getbyId.stock > 5
                      ? "Low Stock"
                      : "Hurry!"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="w-full mt-12 px-4">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">
          You Might Also Like
        </h2>

        {/* Add related products here */}

        {/* Products Grid */}
        <div className="grid md:grid-cols-5 gap-3 mt-5 w-full px-4">
          {allIcecream.length > 0 ? (
            allIcecream.map((item, index) => (
              <div
                key={index}
                className="relative md:w-[17rem] w-[22rem] rounded-xl p-1 md:h-[20rem] grid grid-cols-2 md:grid-cols-none cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white"
              >
                <div className="md:h-[15rem] md:w-full w-[80%] h-full mx-5 md:mx-0">
                  <img
                    src={`http://localhost:3000${item.image}`}
                    alt="icecream"
                    className="object-cover w-full h-full rounded-md"
                  />
                </div>
                <div className="grid md:grid-cols-2">
                  <div className="text-center md:text-start mt-3 md:px-3">
                    <p className="font-semibold text-[1rem] line-clamp-1">
                      {item.name}
                    </p>
                    <p className="text-[0.8rem] text-green-600 font-medium">
                      ${item.price} per 1/kg
                    </p>
                    {item.stock && (
                      <p className="text-[0.7rem] text-gray-500">
                        Stock: {item.stock}
                      </p>
                    )}
                  </div>
                  <div
                    className="md:absolute flex items-center justify-center w-[5rem] h-[2rem] md:top-[85%] left-[60%] bg-orange-300 rounded-md mx-12 md:mx-0 cursor-pointer hover:bg-orange-400 "
                    onClick={() => nav(`/singleview/${item._id}`)}
                  >
                    <p className="text-[0.8rem] font-medium">View</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">{searchQuery ? "🔍" : "🍦"}</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {searchQuery ? "No products found" : "No products found"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery
                  ? `No products found for "${searchQuery}". Try a different search term.`
                  : "Try selecting a different category or check back later."}
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  filterByCategory("all");
                }}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Show All Products
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
