import { Navigate } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children }) {

  const { userInfo } = useContext(AuthContext);

  if (!userInfo) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;