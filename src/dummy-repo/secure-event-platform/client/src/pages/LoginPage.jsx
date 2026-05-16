import { useState } from "react";
import { loginUser } from "../services/authService";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const { setUserInfo } = useContext(AuthContext);
const handleLogin = async (e) => {
  e.preventDefault();

  try {

const data = await loginUser({
  email,
  password,
});

localStorage.setItem(
  "userInfo",
  JSON.stringify(data)
);
setUserInfo(data);
console.log(data);

    console.log(data);

  } catch (error) {

    console.log(error.response.data);

  }
};

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl text-white font-bold mb-6 text-center">
          Login
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-lg bg-gray-800 text-white outline-none"
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-lg bg-gray-800 text-white outline-none"
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 transition-all text-white p-3 rounded-lg font-semibold"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
