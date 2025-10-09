import React, { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Layout2 from "./Layout2";
import Layout3 from "./Layout3";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CategoryNav from "./CategoryNav";

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Add a ref for the timeout
  const searchTimeoutRef = useRef(null);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Fetch products from backend
  const fetchProducts = async (search = "") => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (search) {
        params.append("search", search);
      }

      console.log("Fetching products with params:", params.toString());

      const response = await axios.get(`${API_BASE_URL}/product?${params}`);

      if (response.data.success) {
        setProducts(response.data.data);
        console.log("Products fetched:", response.data.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchProducts();
  }, []);

  // Proper debounced search function - calls backend
  const handleSearch = (query) => {
    setSearchQuery(query);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      fetchProducts(query);
    }, 500); // 500ms delay
  };

  // Reset to show all products
  const handleShowAllProducts = () => {
    setSearchQuery("");
    fetchProducts();
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Helper function to get category name safely
  const getCategoryName = (item) => {
    if (!item.category) return "Uncategorized";

    // If category is an object with name property
    if (typeof item.category === "object" && item.category.name) {
      return item.category.name;
    }

    // If category is just a string (ID)
    return "Category";
  };

  // Your existing GSAP animations...
  const heroTextRef = useRef(null);
  const paraRef = useRef(null);
  const buttonRef = useRef(null);
  const imageRef = useRef(null);
  const categoriesRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from(heroTextRef.current, {
      x: -30,
      opacity: 0,
      duration: 0.3,
      delay: 1.8,
      ease: "power1.out",
    });
    tl.from(paraRef.current, {
      x: -30,
      opacity: 0,
      duration: 0.3,
      ease: "power1.out",
    });
    tl.from(buttonRef.current, {
      x: -30,
      opacity: 0,
      duration: 0.3,
      ease: "power1.out",
    });
    tl.from(
      imageRef.current,
      {
        x: 30,
        opacity: 0,
        duration: 0.3,
        ease: "power1.out",
      },
      "-=1"
    );
    tl.from(
      categoriesRef.current,
      {
        y: 20,
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
      },
      "-=0.5"
    );
  });

  return (
    <div className="min-h-screen w-screen overflow-x-hidden flex flex-col items-center pt-16 font-['cola'] relative">
      {/* Hero Section */}
      <div
        className="w-[95%] sm:w-[90%] lg:w-[85%] xl:w-[80%]
        mt-[5%] md:mt-[0%] lg:mt-[10%]
        bg-white shadow-lg rounded-xl
        p-4 sm:p-6 lg:p-8
        flex flex-col lg:flex-row justify-center items-center"
      >
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="p-4 sm:p-6">
            <h1
              ref={heroTextRef}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-black font-bold leading-tight"
            >
              Crafting Delight, <br /> One Scoop at a Time
            </h1>
            <p
              ref={paraRef}
              className="mt-3 sm:mt-4 text-gray-700 text-sm sm:text-base md:text-lg max-w-lg"
            >
              Discover an artisanal ice cream experience where premium
              ingredients meet creative passion.
            </p>
            <div
              className="flex gap-4 mt-6 justify-center lg:justify-start"
              ref={buttonRef}
            >
              <button
                className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600"
                onClick={() => navigate("/about")}
              >
                Explore
              </button>
              <button className="text-black shadow-lg px-5 py-2 rounded-lg hover:bg-gray-200">
                Learn More
              </button>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 flex justify-center items-center mt-6 lg:mt-0">
          <img
            ref={imageRef}
            src="https://i.pinimg.com/1200x/b7/91/f4/b791f4141ea1164605aa9a6c876b93d4.jpg"
            alt="icecream banner"
            className="w-[80%] max-w-md h-auto object-contain"
          />
        </div>
      </div>

      {/* Products Section */}
      <div ref={categoriesRef} className="w-full max-w-7xl px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
          Our Products
        </h2>

        {/* SEARCH BAR - Backend search */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search products by name or description..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              disabled={loading}
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <span className="text-gray-400">🔍</span>
            </div>
            {searchQuery && (
              <button
                onClick={() => handleSearch("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Active Search Info */}
        <div className="text-center mb-6">
          <p className="text-gray-600">
            {loading ? (
              "Loading products..."
            ) : searchQuery ? (
              <>
                Found {products.length} products matching "
                <span className="font-semibold text-blue-600">
                  {searchQuery}
                </span>
                "
              </>
            ) : (
              <>Showing all {products.length} products</>
            )}
          </p>
        </div>
      </div>
      <CategoryNav />

      {/* Products Grid - All data comes from backend */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-5 w-full max-w-7xl px-4">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading products...</p>
          </div>
        ) : products.length > 0 ? (
          products.map((item) => (
            <div
              key={item._id}
              className="relative bg-white rounded-xl p-4 shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
            >
              <div className="h-48 w-full mb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="object-cover w-full h-full rounded-md"
                  onError={(e) => {
                    e.target.src = "/placeholder-image.jpg";
                  }}
                />
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-lg line-clamp-1">
                  {item.name}
                </p>
                <p className="text-green-600 font-medium">
                  ₹{item.price} per kg
                </p>
                {item.stock && (
                  <p className="text-sm text-gray-500">Stock: {item.stock}</p>
                )}
                <p className="text-sm text-blue-600 capitalize">
                  {getCategoryName(item)}
                </p>
              </div>
              <div
                className="mt-4 flex items-center justify-center w-full h-10 bg-orange-300 rounded-md cursor-pointer hover:bg-orange-400 transition-colors"
                onClick={() => navigate(`/singleview/${item._id}`)}
              >
                <p className="text-sm font-medium">View Details</p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-6xl mb-4">{searchQuery ? "🔍" : "🍦"}</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchQuery ? "No products found" : "No products available"}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery
                ? `No products found for "${searchQuery}". Try a different search term.`
                : "Check back later for new products."}
            </p>
            <button
              onClick={handleShowAllProducts}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Show All Products
            </button>
          </div>
        )}
      </div>

      <Layout2 />
      <Layout3 />
    </div>
  );
};

export default Home;
