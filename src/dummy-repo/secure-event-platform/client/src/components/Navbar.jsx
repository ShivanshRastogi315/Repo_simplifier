import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
function Navbar() {
    const { userInfo, setUserInfo } = useContext(AuthContext);
    const logoutHandler = () => {

  localStorage.removeItem("userInfo");

  setUserInfo(null);
};
  return (
    <nav className="bg-black text-white px-8 py-4 flex justify-between items-center">
      
      <h1 className="text-2xl font-bold">
        Event Media
      </h1>

      <div className="flex gap-6 text-lg">
        <Link to="/">Home</Link>

        <Link to="/login">Login</Link>

        <Link to="/register">Register</Link>
      </div>

    </nav>
  );
}

export default Navbar;