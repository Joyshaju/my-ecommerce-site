import React from "react";

function Orders({ orders = [] }) {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
    
      <h2 className="text-3xl font-bold mb-6 text-center">Your Orders & Returns</h2>
      
      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-xl font-semibold">{order.name}</h3>
              <p className="text-gray-600">${order.price}</p>
              <img src={order.image} alt={order.name} className="w-24 h-24 mt-2 object-cover" />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-lg text-gray-700">You have no orders yet.</p>
      )}
      <div className="flex justify-center mt-6">
  <button
    onClick={() => window.location.href = "/"}
    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
  >
    Shop More
  </button>
</div>
    </div>
  );
}
export default Orders;
