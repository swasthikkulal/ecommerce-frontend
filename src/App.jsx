import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Nav from "./components/Nav";
import Home from "./components/Home";
import About from "./components/About";
import Cart from "./components/Cart";
import Contact from "./components/Contact";
import SingleViewPage from "./components/SinglePage";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import CartPage from "./pages/CartPage";
import OrderPlaced from "./components/OrderPlaced";
import Register from "./pages/Register";
import AdminPage from "./pages/AdminPage";
import AddProduct from "./pages/AddProduct";
import CheckAllUsers from "./pages/CheckAllUsers";
import ScrollToTop from "./components/ScrollToTop";
import OrdersPage from "./pages/OrderPage";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="App w-screen min-h-screen ">
        <Nav />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/singleview/:id" element={<SingleViewPage />} />
          <Route path="/cartpage" element={<CartPage />} />
          <Route path="/orderplaced" element={<OrderPlaced />} />
          <Route path="/adminpage" element={<AdminPage />} />
          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/checkallusers" element={<CheckAllUsers />} />
          <Route path="/orderpage" element={<OrdersPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
