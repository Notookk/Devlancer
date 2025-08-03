import axios from "axios";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    console.log("🔐 Login Data:", data);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        data
      );
      console.log(res.data);
      localStorage.setItem("token", res.data.token);
      navigate("/home");
    } catch (error) {
      console.log(error);

      console.log("Error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-199">
      <h2 className="welcome text-4xl font-bold text-center absolute text-gray-800  mb-130 font-sans">
        Welcome Back
      </h2>
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            {...register("email", { required: true })}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring focus:border-green-400"
          />
          {errors.email && (
            <p className="text-sm text-red-500">Email is required</p>
          )}

          <input
            type="password"
            placeholder="Password"
            {...register("password", { required: true })}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring focus:border-green-400"
          />
          {errors.password && (
            <p className="text-sm text-red-500">Password is required</p>
          )}

          <button
            type="submit"
            className="button w-full bg-green-600 text-white py-2 rounded-xl"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="text-green-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
