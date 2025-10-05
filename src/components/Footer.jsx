import React, { useState } from "react";

const Footer = () => {
  const token = localStorage.getItem("token");
  const [formData, setformData] = useState({
    name: "",
    email: "",
    description: "",
  });
  const handleChange = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await fetch("http://localhost:3000/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json", "auth-token": token },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        alert("your feedback sent successfully");
        setformData({ name: "", email: "", description: "" });
      } else {
        console.log("invalid credentials");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="w-full border-black/5 bg-neutral-800/5 rounded-md mt-[2%]">
      <footer className="md:h-[60vh] h-[130vh]">
        <div className="flex items-center md:justify-between md:pr-[3rem] md:p-0 p-2">
          <div className="p-[3%] mx-[5%]">
            <p className="md:text-xl font-semibold text-sm">
              Subscribe to Updates
            </p>
            <p className="md:text-[1rem] text-[0.7rem]">
              Stay informed about our latest offers and products
            </p>
          </div>
          {/* Social Links Replacement */}
          <div className="flex gap-4 mr-5">
            {["Facebook", "Instagram", "Twitter", "LinkedIn"].map(
              (platform) => (
                <div
                  key={platform}
                  className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300"
                  title={platform}
                >
                  <span className="text-xs font-semibold">
                    {platform.charAt(0)}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <div className="md:mx-[2%] mx-10">
            <div className="text-start md:mx-[10%] flex gap-0.5">
              <p className="md:text-2xl text-xl font-semibold">.Fruitify</p>
              <p className="border border-red-500 text-[0.5rem] px-1 py-0.5 text-red-500 rounded-sm h-fit">
                beta
              </p>
            </div>
          </div>
          <div className="mt-[2%] grid md:grid-cols-5 items-center justify-center md:gap-[10%] gap-[5%] p-10">
            <form
              className="flex flex-col w-[20rem] gap-[1rem]"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                className="border border-black h-[2.5rem] px-3 rounded-md outline-none md:text-[1rem] container"
                placeholder="Enter the Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                className="border border-black h-[2.5rem] px-3 rounded-md outline-none md:text-[1rem] container"
                placeholder="Enter the Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <textarea
                name="description"
                className="border border-black h-[5rem] px-3 rounded-md outline-none md:text-[1rem] pt-1 container"
                placeholder="Enter the Description"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>

              <button
                type="submit"
                className="w-full h-[3rem] bg-orange-400 text-white rounded-md font-semibold hover:bg-orange-500 transition-colors duration-200 flex items-center justify-center"
              >
                Subscribe Now
              </button>
            </form>

            <div className="md:mx-10 mx-0">
              <p className="md:text-[1rem] text-[0.8rem] font-semibold md:mb-4 mb-2">
                Follow Us
              </p>
              <p className="md:text-[1rem] text-[0.8rem] md:mb-2 mb-1 cursor-pointer hover:text-orange-500">
                Facebook
              </p>
              <p className="md:text-[1rem] text-[0.8rem] md:mb-2 mb-1 cursor-pointer hover:text-orange-500">
                Instagram
              </p>
              <p className="md:text-[1rem] text-[0.8rem] md:mb-2 mb-1 cursor-pointer hover:text-orange-500">
                X
              </p>
              <p className="md:text-[1rem] text-[0.8rem] md:mb-2 mb-1 cursor-pointer hover:text-orange-500">
                LinkedIn
              </p>
            </div>
            <div>
              <p className="md:text-[1rem] text-[0.8rem] font-semibold md:mb-4 mb-2">
                Legal
              </p>
              <p className="md:text-[1rem] text-[0.8rem] md:mb-2 mb-1 cursor-pointer hover:text-orange-500">
                Privacy Policy
              </p>
              <p className="md:text-[1rem] text-[0.8rem] md:mb-2 mb-1 cursor-pointer hover:text-orange-500">
                Terms of Use
              </p>
              <p className="md:text-[1rem] text-[0.8rem] md:mb-2 mb-1 cursor-pointer hover:text-orange-500">
                Cookie Policy
              </p>
              <p className="md:text-[1rem] text-[0.8rem] md:mb-2 mb-1 cursor-pointer hover:text-orange-500">
                Accessibility
              </p>
            </div>
            <div>
              <p className="md:text-[1rem] text-[0.8rem] font-semibold md:mb-4 mb-2">
                Contact
              </p>
              <p className="md:text-[1rem] text-[0.8rem] md:mb-2 mb-1 cursor-pointer hover:text-orange-500">
                Customer Support
              </p>
              <p className="md:text-[1rem] text-[0.8rem] md:mb-2 mb-1 cursor-pointer hover:text-orange-500">
                Email Us
              </p>
              <p className="md:text-[1rem] text-[0.8rem] md:mb-2 mb-1 cursor-pointer hover:text-orange-500">
                Feedback Form
              </p>
              <p className="md:text-[1rem] text-[0.8rem] md:mb-2 mb-1 cursor-pointer hover:text-orange-500">
                Help Center
              </p>
            </div>
            <div>
              <p className="md:text-[1rem] text-[0.8rem] font-semibold md:mb-4 mb-2">
                Customer Service
              </p>
              <p className="md:text-[1rem] text-[0.8rem] md:mb-2 mb-1 cursor-pointer hover:text-orange-500">
                Return Policy
              </p>
              <p className="md:text-[1rem] text-[0.8rem] md:mb-2 mb-1 cursor-pointer hover:text-orange-500">
                Shipping Info
              </p>
              <p className="md:text-[1rem] text-[0.8rem] md:mb-2 mb-1 cursor-pointer hover:text-orange-500">
                Gift Cards
              </p>
              <p className="md:text-[1rem] text-[0.8rem] md:mb-2 mb-1 cursor-pointer hover:text-orange-500">
                Track Order
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
