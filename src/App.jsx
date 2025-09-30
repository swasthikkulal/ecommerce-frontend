import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Nav from "./components/nav";
import Home from "./components/Home";
import About from "./components/About";
import Cart from "./components/Cart";
import Contact from "./components/Contact";
import SingleViewPage from "./components/SinglePage";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <div className="App w-screen min-h-screen ">
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/singleview/:id" element={<SingleViewPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
