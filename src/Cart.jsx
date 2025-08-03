import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Cart({ removeFromCart, checkout }) {
  const [cartItems, setCartItems] = useState([]);
  const [loggedIn, setLoggedIn] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/cart", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error && data.error.toLowerCase().includes("not logged in")) {
          setLoggedIn(false);
        } else {
          setCartItems(data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching cart:", error);
        setLoggedIn(false);
        setLoading(false);
      });
  }, []);

  const handleRemoveFromCart = (productId) => {
    fetch(`http://localhost:8000/remove-from-cart/${productId}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((response) => response.json())
      .then(() => {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.id !== productId)
        );
        removeFromCart(productId);
      })
      .catch((error) => {
        console.error("Error removing from cart:", error);
      });
  };

  if (loading) {
    return <p className="text-center mt-8">Loading your cart...</p>;
  }

  if (!loggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-4">
        <h2 className="text-2xl font-bold mb-4">Please log in to view your cart</h2>
        <div className="space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h3 className="font-bold text-2xl flex items-center justify-center mb-4">
        Your items in cart
      </h3>

      <div
        className="cursor-pointer hover:underline flex justify-end"
        onClick={() => navigate("/")}
      >
        Home
      </div>

      {cartItems.length === 0 ? (
        <h3 className="text-xl flex items-center justify-center mt-4">
          Your cart is empty
        </h3>
      ) : (
        <>
          <ul className="space-y-4 mt-4">
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="bg-white p-4 rounded shadow flex justify-between items-center"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p>${parseFloat(item.price).toFixed(2)}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveFromCart(item.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Remove from cart
                </button>
              </li>
            ))}
          </ul>

          <div className="flex justify-center mt-6">
            <button
              onClick={() => {
                checkout();
                navigate("/orders");
              }}
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;