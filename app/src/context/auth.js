import { createContext, useContext, useState, useMemo } from "react";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  function login(token) {
    const _user = { token };
    localStorage.setItem("user", JSON.stringify(_user));
    setUser(_user);
    return _user;
  }

  function logout() {
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{
        user,
        login,
        logout,
      }}>{children}</AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthContext, AuthProvider, useAuth };
