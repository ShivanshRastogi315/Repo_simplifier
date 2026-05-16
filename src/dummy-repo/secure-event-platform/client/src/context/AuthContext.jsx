import { createContext, useState } from "react";

export const AuthContext = createContext();

function AuthProvider({ children }) {

  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("userInfo")) || null
  );

  return (
    <AuthContext.Provider
      value={{
        userInfo,
        setUserInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;