import { createContext, useEffect, useState } from "react";
import useApiRequest from "../hooks/useApi";
import { authBase, login as loginEndpoint } from "../endpoints";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { assignLocalStorage } from "../functions";
import { updateUser } from "../../pages/Home/Billing/slices/userSlice";

export const AuthContext = createContext<any | undefined>(undefined);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();
  const userInfo = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const { apiRequest, response } = useApiRequest();

  const updateContextViaToken = (decodedToken, route = "/") => {
    setIsAuthenticated(true);
    dispatch(updateUser({ key: "role", value: decodedToken?.role }));
    dispatch(updateUser({ key: "userId", value: decodedToken?.id }));
    dispatch(
      updateUser({
        key: "restaurantId",
        value: decodedToken?.restaurant?._id || decodedToken?.restaurant,
      })
    );
    navigate(route);
  };

  // useEffect(() => {
  //   const savedToken = localStorage.getItem("isAuthenticated");
  //   if (savedToken) {
  //     setIsAuthenticated(true);
  //   }
  // }, []);

  useEffect(() => {
    const checkAuth = () => {
      const savedToken = localStorage.getItem("authToken"); // Check for authToken instead of isAuthenticated
      if (savedToken) {
        try {
          // Verify the token is valid
          const decodedToken = jwtDecode(savedToken);
          // console.log(decodedToken);
          if (decodedToken) {
            updateContextViaToken(decodedToken);
            // navigate("/");
          }
        } catch (error) {
          // If token is invalid, clear it
          localStorage.removeItem("authToken");
          setIsAuthenticated(false);
          console.error(error);
        }
      } else {
        setIsAuthenticated(false);
      }
      // setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials: any) => {
    const login = await apiRequest("POST", loginEndpoint, credentials);
    if (login) {
      // localStorage.setItem("isAuthenticated", "true");
      assignLocalStorage("authToken", login?.token);
      assignLocalStorage("userId", login?.userId);
      const decodedToken = jwtDecode(login?.token);
      console.log(decodedToken);
      updateContextViaToken(decodedToken);
      // navigate("/");
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("userId");
    navigate("/login");
  };

  const assignRestaurant = async (userId, restaurantId) => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");

    try {
      const user = await apiRequest("PATCH", `${authBase}/${userId}`, {
        restaurant: restaurantId,
      });

      if (user && user.token) {
        assignLocalStorage("authToken", user?.token);
        const decodedToken = jwtDecode(user?.token);
        if (decodedToken) {
          // logout();
          updateContextViaToken(decodedToken, "/billing");
          // window.location.reload();
          // navigate("/billing");
        }
      }
    } catch (error) {
      console.error("Error assigning restaurant:", error);
    }
  };

  const decodeToken = () => {
    try {
      const token: any = localStorage.getItem("authToken");
      const decodedToken = jwtDecode(token);
      return decodedToken;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, decodeToken, logout, assignRestaurant }}
    >
      {children}
    </AuthContext.Provider>
  );
};
