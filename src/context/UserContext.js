import React, { createContext, useContext, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import Loader from "@/components/common/Loader";

// Create a context with initial values
const UserContext = createContext({
  id: null,
  loading: false,
  setLoading: () => {},
  userRole: 1,
  setUserRole: () => {},

  setId: () => {},
  loggedStatus: false,
  setLoggedStatus: (st) => {},
  user: null,
  setUser: (us) => {},
  setDoctorLogged: (val) => {},
  logout: () => {},
});

// Create a provider component
export const UserProvider = ({ children }) => {
  const [id, setId] = useState(null);
  const [userRole, setUserRole] = useState();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  function isMoreThan24HoursAgo(epochTime) {
    const secondsIn24Hours = 24 * 60 * 60;
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime - epochTime > secondsIn24Hours;
  }

  useEffect(() => {
    if (pathname == "/admin/signin") return setLoading(false);

    const storageNow = localStorage.getItem("now");
    const storedId = localStorage.getItem("userId");

    if (!isMoreThan24HoursAgo(storageNow) && storedId) {
      setId(storedId);
    }
  }, []);



  const logout = () => {
    setId(null);
    setUserRole(1);
    localStorage.removeItem("userId");
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
