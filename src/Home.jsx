import React from "react";
import { useNavigate } from "react-router-dom";
import Products from "./product";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useUser } from "./UserContext";

function Home({ addToCart }) {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <div className="bg-blue-400 min-h-screen min-w-screen">
      <header className="bg-amazon_blue text-black flex items-center p-4">
        <h1 className="text-2xl font-bold mr-8">Web Shop</h1>
        <input
          type="text"
          placeholder="Search"
          className="px-4 py-2 rounded-md text-black"
        />
        <div className="flex space-x-6 text-sm ml-auto items-center">
          {user ? (
            <>
              <div className="flex flex-col items-center">
                <img
                  src={
                    user.profile_image
                      ? `${user.profile_image}?${Date.now()}`
                      : "https://via.placeholder.com/100"
                  }
                  alt="Profile"
                  className="w-8 h-8 rounded-full border object-cover"
                />
                <div
                  className="cursor-pointer  hover:underline"
                  onClick={() => navigate("/account")}
                >
                  Account
                </div>
              </div>
            </>
          ) : (
            <div
              className="cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              Sign in
            </div>
          )}

          <div
            className="cursor-pointer hover:underline"
            onClick={() => navigate("/orders")}
          >
            Returns & Orders
          </div>
          <div
            className="cursor-pointer hover:underline"
            onClick={() => navigate("/cart")}
          >
            Cart
          </div>
        </div>
      </header>

      <section className="relative">
        <Carousel
          autoPlay
          infiniteLoop
          showThumbs={false}
          showStatus={false}
          interval={3000}
          className="text-center"
        >
          <div>
            <img
              src="https://plus.unsplash.com/premium_photo-1672883552013-506440b2f11c?w=1600&auto=format&fit=crop&q=60"
              alt="Welcome to Web Shop"
              className="h-160 object-cover"
            />
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1567266230512-eabb325d4b62?w=900&auto=format&fit=crop&q=60"
              alt="Best Deals Today"
              className="h-160 object-cover"
            />
          </div>
          <div>
            <img
              src="https://plus.unsplash.com/premium_photo-1699855177041-847f17adb78d?w=900&auto=format&fit=crop&q=60"
              alt="Click Here To Shop"
              className="h-160 object-cover"
            />
          </div>
        </Carousel>
      </section>

      <Products addToCart={addToCart} />
    </div>
  );
}

export default Home;
