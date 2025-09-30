import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // For hamburger icons
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Navbar = () => {
  const logoRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  useGSAP(() => {
    const tl = gsap.timeline();

    // Animate the logo
    tl.from(logoRef.current, {
      y: "-10%",
      duration: 1,
      delay: 0.5,
      opacity: 0,
      ease: "power2.out",
    });

    // Animate the navigation links
    tl.from(".navanimation", {
      y: -10,
      duration: 0.3,
      opacity: 0,
      stagger: 0.2,
      ease: "power1.out",
    });
  }, []);

  return (
    <nav className="backdrop-blur-sm text-black shadow-lg fixed top-0 w-full z-50 font-['cola']">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="text-4xl font-bold tracking-wide">
            <span ref={logoRef} className="font-[icecream]">
              IceCream
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 navanimation">
            <Link to="/" className="hover:text-yellow-300 transition">
              Home
            </Link>
            <Link to="/about" className="hover:text-yellow-300 transition">
              About
            </Link>
            <Link to="/courses" className="hover:text-yellow-300 transition">
              Courses
            </Link>
            <Link to="/admissions" className="hover:text-yellow-300 transition">
              Admissions
            </Link>
            <Link to="/contact" className="hover:text-yellow-300 transition">
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-black focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white px-4 py-4 space-y-3">
          <Link
            to="/"
            className="block hover:text-yellow-300 transition"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="block hover:text-yellow-300 transition"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link
            to="/courses"
            className="block hover:text-yellow-300 transition"
            onClick={() => setIsOpen(false)}
          >
            Courses
          </Link>
          <Link
            to="/admissions"
            className="block hover:text-yellow-300 transition"
            onClick={() => setIsOpen(false)}
          >
            Admissions
          </Link>
          <Link
            to="/contact"
            className="block hover:text-yellow-300 transition"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
