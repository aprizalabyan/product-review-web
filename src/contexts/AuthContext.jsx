import { createContext, useContext, useState } from "react";
import axios from "axios";
import { SessionUtils } from "../utils/session";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return SessionUtils.getSession();
  });

  const login = async (email, password) => {
    try {
      const loginRes = await axios.post("/product-review-api/login", {
        email,
        password,
      });
      if (loginRes.status === 200) {
        const { access_token, refresh_token } = loginRes.data;
        const meRes = await axios.get("/product-review-api/me", {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        const { id, name, email } = meRes.data;
        const session = {
          id,
          name,
          email,
          access_token,
          refresh_token,
        };
        SessionUtils.setSession(session);
        setUser(session);
      }
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const logout = () => {
    SessionUtils.removeSession();
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
