import React, { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Layout2 from "./Layout2";
import Layout3 from "./Layout3";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [allIcecream, setAllIcecream] = useState([]);
  const [filteredIcecream, setFilteredIcecream] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("none"); // 🔥 New state for A-Z sorting

  // Categories data
  const categories = [
    { id: "all", name: "All Products", icon: "🍦" },
    { id: "chocolate", name: "Chocolate", icon: "🍫" },
    { id: "sugarfree", name: "Sugar Free", icon: "🩺" },
    { id: "fruity", name: "Fruity", icon: "🍓" },
    { id: "vanilla", name: "Vanilla", icon: "🌱" },
    { id: "premium", name: "Premium", icon: "⭐" },
  ];

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/product")
      .then((res) => {
        setAllIcecream(res.data.data);
        setFilteredIcecream(res.data.data);
      })
      .catch((err) => console.log(err.message));
  }, []);

  // Filter products by category
  const filterByCategory = (categoryId) => {
    setActiveCategory(categoryId);

    let filtered = [];
    if (categoryId === "all") {
      filtered = allIcecream;
    } else {
      filtered = allIcecream.filter((item) => {
        const name = item.name?.toLowerCase() || "";
        const description = item.description?.toLowerCase() || "";
        switch (categoryId) {
          case "chocolate":
            return (
              name.includes("chocolate") ||
              description.includes("chocolate") ||
              name.includes("cocoa") ||
              description.includes("cocoa") ||
              name.includes("fudge") ||
              description.includes("fudge")
            );
          case "sugarfree":
            return (
              name.includes("sugar free") ||
              description.includes("sugar free") ||
              name.includes("sugar-free") ||
              description.includes("sugar-free") ||
              name.includes("no sugar") ||
              description.includes("no sugar")
            );
          case "fruity":
            return (
              name.includes("strawberry") ||
              description.includes("strawberry") ||
              name.includes("berry") ||
              description.includes("berry") ||
              name.includes("fruit") ||
              description.includes("fruit") ||
              name.includes("mango") ||
              description.includes("mango") ||
              name.includes("pineapple") ||
              description.includes("pineapple")
            );
          case "vanilla":
            return (
              name.includes("vanilla") ||
              description.includes("vanilla") ||
              name.includes("cream") ||
              description.includes("cream")
            );
          case "premium":
            return (
              name.includes("premium") ||
              description.includes("premium") ||
              name.includes("gourmet") ||
              description.includes("gourmet") ||
              name.includes("artisanal") ||
              description.includes("artisanal") ||
              parseFloat(item.price) > 6
            );
          default:
            return true;
        }
      });
    }

    // Apply sorting after filtering
    setFilteredIcecream(sortIcecream(filtered, sortOrder));
  };

  // 🔥 Sorting function
  const sortIcecream = (list, order) => {
    const sorted = [...list];
    if (order === "asc") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (order === "desc") {
      sorted.sort((a, b) => b.name.localeCompare(a.name));
    }
    return sorted;
  };

  // 🔥 Handle sort change
  const handleSortChange = (order) => {
    setSortOrder(order);
    setFilteredIcecream(sortIcecream(filteredIcecream, order));
  };

  const checkAdmin = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/admin/check", {
        method: "GET",
        headers: { "Content-Type": "application/json", "auth-token": token },
      });
      const data = await res.json();
      if (data.success) {
        navigate("/adminpage");
      } else {
        alert("only admin can access this page");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

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
    <div className="min-h-screen w-full flex flex-col items-center pt-16 font-['cola'] ">
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
              <button className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600">
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

      {/* Categories Section */}
      <div ref={categoriesRef} className="w-full max-w-7xl px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
          Browse by Category
        </h2>

        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => filterByCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition
                ${
                  activeCategory === category.id
                    ? "bg-blue-500 text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 shadow-md hover:bg-gray-50"
                }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Sorting Section */}
        <div className="flex justify-center gap-3 mb-6">
          <button
            onClick={() => handleSortChange("asc")}
            className={`px-4 py-2 rounded-lg transition ${
              sortOrder === "asc"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 shadow-md hover:bg-gray-50"
            }`}
          >
            A → Z
          </button>
          <button
            onClick={() => handleSortChange("desc")}
            className={`px-4 py-2 rounded-lg transition ${
              sortOrder === "desc"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 shadow-md hover:bg-gray-50"
            }`}
          >
            Z → A
          </button>
        </div>

        {/* Active Category Info */}
        <div className="text-center mb-6">
          <p className="text-gray-600">
            Showing {filteredIcecream.length} products in{" "}
            <span className="font-semibold text-blue-600">
              {categories.find((cat) => cat.id === activeCategory)?.name}
            </span>
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-5 gap-3 mt-5 w-full  px-4">
        {filteredIcecream.length > 0 ? (
          filteredIcecream.map((item, index) => (
            <div
              key={index}
              className="md:w-[17rem] w-[22rem] rounded-xl p-1 md:h-[20rem] grid grid-cols-2 md:grid-cols-none cursor-pointer border bg-neutral-800/5 hover:shadow-lg"
            >
              <div className="md:h-[15rem] md:w-full w-[80%] h-full mx-5 md:mx-0">
                <img
                  src={item.image}
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
                  className="flex items-center justify-center w-[5rem] h-[2rem] bg-orange-300 rounded-md mx-12 md:mx-0 cursor-pointer hover:bg-orange-400"
                  onClick={() => navigate(`/singleview/${item._id}`)}
                >
                  <p className="text-[0.8rem] font-medium">View</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-6xl mb-4">🍦</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No products found
            </h3>
            <p className="text-gray-500 mb-4">
              Try selecting a different category or check back later.
            </p>
            <button
              onClick={() => filterByCategory("all")}
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
