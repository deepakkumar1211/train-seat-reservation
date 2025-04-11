import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate(); 
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(""); // To show login error messages
  const [success, setSuccess] = useState(false); // Track if login was successful
  const [username, setUsername] = useState(""); // Store username for welcome message

  // Handle form input changes
  const handleChange = (e) => {
    // Update the corresponding field and reset messages
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); 
    setSuccess(false); 
  };

  // Handle form submission
  // const handleSubmit = async (e) => {
  //   e.preventDefault(); // Prevent default form refresh

  //   try {
  //     // Send login request to backend API
  //     const response = await fetch(`${process.env.BACKEND_API_URL}/api/v1/auth/login`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(form), // Send email and password
  //     });

  //     const data = await response.json();

  //     // Handle failed login
  //     if (!response.ok) {
  //       throw new Error(data.message || "Login failed");
  //     }

  //     // Store token and user info in localStorage
  //     localStorage.setItem("token", data.token);
  //     localStorage.setItem("user", JSON.stringify(data.user));
      
  //     setUsername(data.user.username); // Show username in success message
  //     setSuccess(true); // Trigger success UI

  //     // Redirect to home page after delay
  //     setTimeout(() => {
  //       navigate("/");
  //     }, 1500);
  //   } catch (err) {
  //     // Display error message
  //     setError(err.message);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form refresh
  
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form), // Send email and password
      });
  
      let data;
      try {
        data = await response.json();
      } catch (jsonErr) {
        throw new Error("Oops! The server returned something unexpected. Please try again in a moment.");
      }
  
      if (!response.ok) {
        throw new Error(data.message || "Hmm... we couldn't log you in. Please double-check your credentials.");
      }
  
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
  
      setUsername(data.user.username); // Show username in success message
      setSuccess(true); // Trigger success UI
  
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      // Fancy error message
      setError(err.message || "Something went wrong! Try refreshing or check back later.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded p-6 mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

      {/* Error message */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Success message */}
      {success && (
        <p className="text-green-600 text-center mb-2">
          Login successful! Welcome, <span className="font-semibold">{username}</span>
        </p>
      )}

      {/* Login form */}
      <form onSubmit={handleSubmit} className="space-y-4">
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
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>

      {/* Registration prompt */}
      {!success && (
        <p className="mt-4 text-center text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 underline">
            Register now
          </Link>
        </p>
      )}
    </div>
  );
}

export default Login;

