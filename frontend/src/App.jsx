import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./login";
import Cart from "./Cart";
import Register from "./Register";
import Orders from "./Orders";
import Account from "./Account";

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);

  const addToCart = (item) => {
    setCartItems((prev) => [...prev, item]);
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const checkout = () => {
    const time = new Date().toLocaleString();
    const orderedItems = cartItems.map((item) => ({
      ...item,
      orderDate: time,
    }));
    setOrders((prev) => [...prev, ...orderedItems]);
    setCartItems([]);
  };

  return (
    <Routes>
      <Route path="/" element={<Home addToCart={addToCart} />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/cart"
        element={
          <Cart
            cartItems={cartItems}
            removeFromCart={removeFromCart}
            checkout={checkout}
          />
        }
      />
      <Route path="/register" element={<Register />} />
      <Route path="/orders" element={<Orders orders={orders} />} />
      <Route path="/account" element={<Account />} />
    </Routes>
  );
}

export default App;