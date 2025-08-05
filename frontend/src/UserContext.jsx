import { createContext, useContext, useEffect, useState } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await fetch("https://aded34ci4999.ngrok-free.app", {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        console.log("✅ User session fetched:", data);
        setUser(data);
      } else {
        console.warn("⚠️ No valid session found");
        setUser(null);
      }
    } catch (err) {
      console.error("❌ Failed to fetch user session", err);
      setUser(null);
    }
  };

  const logoutUser = () => {
    console.log("🔒 Logging out");
    setUser(null);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser: fetchUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);