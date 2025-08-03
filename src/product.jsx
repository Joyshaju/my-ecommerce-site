import React, { useState, useEffect } from "react";

function Products({ addToCart }) {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    fetch("http://localhost:8000/products")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched products:", data); 
        setProducts(data);
      });
  }, []);
  const handleAddToCart = (product) => {
    addToCart(product);
    fetch("http://localhost:8000/add-to-cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials:"include",
      body: JSON.stringify({
        name: product.name,
        image: product.image,
        price: product.price,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Backend response:", data);
      })
      .catch((error) => {
        console.error("Error adding to cart:", error);
      });
  };
  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white p-4 rounded shadow flex flex-col items-center"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover rounded"
          />
          <h3 className="text-lg font-bold mt-2">{product.name}</h3>
          <p className="text-gray-700">${product.price}</p>
          <button
            onClick={() => handleAddToCart(product)}
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}
export default Products;