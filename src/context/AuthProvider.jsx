import React, { createContext, useEffect, useState } from "react";
import { useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const initialUserState = localStorage.getItem("messenger");
  const [authUser, setAuthUser] = useState(
    initialUserState ? JSON.parse(initialUserState) : undefined
  );

  useEffect(() => {
    if (authUser?.token) {
      axios.defaults.headers.common.Authorization = `Bearer ${authUser.token}`;
    } else {
      delete axios.defaults.headers.common.Authorization;
    }
  }, [authUser]);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);