import React, { useEffect, useState } from "react";
import { useUser } from "./UserContext";
import { useNavigate } from "react-router-dom";

function Account() {
  const apiBase = import.meta.env.VITE_API_URL; 
  const [user, setUser] = useState({});
  const [edit, setEdit] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const { refreshUser, logoutUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://aded34ci4999.ngrok-free.app", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, []);

  const handleLogout = async () => {
    const res = await fetch("https://aded34ci4999.ngrok-free.app", {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    alert(data.message || "Logged out");
    logoutUser(); 
    navigate("/login"); 
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    fetch("https://aded34ci4999.ngrok-free.app", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name: user.name,
        address: user.address,
        phone: user.phone,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        setEdit(false);
      });
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!imageFile) return alert("Please choose an image");

    const formData = new FormData();
    formData.append("image", imageFile);

    const res = await fetch("https://aded34ci4999.ngrok-free.app", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await res.json();
    alert(data.message || "Upload successful");

    await refreshUser(); 
    const refreshed = await fetch("https://aded34ci4999.ngrok-free.app", {
      credentials: "include",
    });
    const userData = await refreshed.json();
    setUser(userData);
  };
  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 shadow rounded">
      <img
                src={
                  user.profile_image
                    ? `${user.profile_image}?${Date.now()}`
                    : "https://via.placeholder.com/100"
                }
                alt="Profile"
                className="w-full h-80 rounded-4xl border object-cover"
      />

      <form onSubmit={handleImageUpload} className="mb-4">
        <input
          type="file"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="mb-2"
        />
        <button
          type="submit"
          className="bg-purple-400 hover:bg-purple-500 text-white w-full py-1 rounded text-sm"
        >
          Upload Profile Image
        </button>
      </form>

      {edit ? (
        <>
          <input
            name="name"
            value={user.name || ""}
            onChange={handleChange}
            className="border w-full p-2 mb-2"
            placeholder="Name"
          />
          <input
            name="address"
            value={user.address || ""}
            onChange={handleChange}
            className="border w-full p-2 mb-2"
            placeholder="Address"
          />
          <input
            name="phone"
            value={user.phone || ""}
            onChange={handleChange}
            className="border w-full p-2 mb-2"
            placeholder="Phone"
          />
          <button
            onClick={handleUpdate}
            className="bg-green-500 text-white w-full py-2 rounded"
          >
            Save
          </button>
        </>
      ) : (
        <>
          <p>
            <strong>Name:</strong> {user.name || "Not set"}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Address:</strong> {user.address || "Not set"}
          </p>
          <p>
            <strong>Phone:</strong> {user.phone || "Not set"}
          </p>
          <button
            onClick={() => setEdit(true)}
            className="bg-blue-400 text-white w-full hover:bg-blue-500 mt-4 py-2 rounded"
          >
            Edit Info
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-400 text-white w-50 mt-4 hover:bg-red-500 py-2 rounded-3xl"
          >
            Logout
          </button>
          <button
            onClick={()=>navigate("/")}
            className="bg-red-400 text-white w-50 mt-4 hover:bg-red-500 py-2 rounded-3xl"
          >
            Home
          </button>
        </>
      )}
    </div>
  );
}

export default Account;
