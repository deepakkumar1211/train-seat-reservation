import { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
  // State for form input
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  // State for error and success message
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Handle form input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");     
    setSuccess(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make POST request to backend API
      const res = await fetch(`${process.env.BACKEND_API_URL}/api/v1/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      // Handle failed registration
      if (!res.ok) {
        // Custom error messages for duplicate email or username
        if (data.message?.toLowerCase().includes("email")) {
          throw new Error("Email already exists. Please use another email.");
        } else if (data.message?.toLowerCase().includes("username")) {
          throw new Error("Username already taken. Try with another username.");
        } else {
          throw new Error(data.message || "Registration failed");
        }
      }

      // Save token to localStorage
      localStorage.setItem("token", data.token);

      // Show success message
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded p-6 mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

      {/* Display error message */}
      {error && <p className="text-red-500 text-xl font-semibold text-center">{error}</p>}

      {/* Display success message and login link */}
      {success && (
        <p className="text-green-600 text-xl font font-semibold text-center mb-2">
          Registration successful!{" "}
          <Link to="/login" className="text-blue-600 underline">
            Login now
          </Link>
        </p>
      )}

      {/* Registration form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Register
        </button>
      </form>

      {/* Link to login if already registered */}
      {!success && (
        <p className="mt-4 text-center text-sm">
          Already registered?{" "}
          <Link to="/login" className="text-blue-600 underline">
            Login now
          </Link>
        </p>
      )}
    </div>
  );
}

export default Register;
