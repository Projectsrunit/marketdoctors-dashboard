import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Loader from "@/components/common/Loader";

// Create a context with initial values
const UserContext = createContext({
  id: null,
  loading: false,
  setLoading: () => {},
  userRole: 1,
  setUserRole: () => {},
  setId: () => {},
  logout: () => {},
});

// Create a provider component
export const UserProvider = ({ children }) => {
  const [id, setId] = useState(null);
  const [userRole, setUserRole] = useState(1);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    const storageNow = localStorage.getItem("now");

    function isMoreThan24HoursAgo(epochTime) {
      const secondsIn24Hours = 24 * 60 * 60;
      const currentTime = Math.floor(Date.now() / 1000);
      return currentTime - epochTime > secondsIn24Hours;
    }

    // Check if the stored ID is valid and within 24 hours
    if (storedId && !isMoreThan24HoursAgo(storageNow)) {
      setId(storedId);
    } else if (pathname !== "/") {
      setLoading(true);

      // Redirect after 5 seconds if no valid ID
      setTimeout(() => {
        setLoading(false);
        window.location.href = "/";
      }, 5000);
    }
  }, [pathname]);

  useEffect(() => {
    // Update localStorage whenever ID changes
    if (id) {
      localStorage.setItem("userId", id);
      localStorage.setItem("now", Math.floor(Date.now() / 1000)); // Save the current timestamp
    }
  }, [id]);

  const logout = () => {
    setId(null);
    setUserRole(1);
    localStorage.removeItem("userId");
    localStorage.removeItem("now");
    window.location.href = "https://marketdoctors.com.ng/";
  };

  return (
    <UserContext.Provider
      value={{
        id,
        setId,
        userRole,
        setUserRole,
        logout,
      }}
    >
      {loading ? <Loader /> : children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
