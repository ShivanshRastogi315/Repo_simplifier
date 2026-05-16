import { useState } from "react";
import { registerUser } from "../services/authService";
function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

const handleRegister = async (e) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    return console.log("Passwords do not match");
  }

  try {

    const data = await registerUser({
      name,
      email,
      password,
    });

    console.log(data);

  } catch (error) {

    console.log(error.response.data);

  }
};

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl shadow-lg">
        
        <h1 className="text-3xl text-white font-bold mb-6 text-center">
          Register
        </h1>

        <form
          onSubmit={handleRegister}
          className="flex flex-col gap-4"
        >

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 rounded-lg bg-gray-800 text-white outline-none"
          />

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

          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="p-3 rounded-lg bg-gray-800 text-white outline-none"
          />

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 transition-all text-white p-3 rounded-lg font-semibold"
          >
            Register
          </button>

        </form>
      </div>
    </div>
  );
}

export default RegisterPage;