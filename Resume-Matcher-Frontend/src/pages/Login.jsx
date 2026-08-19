import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(formData);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Check your credentials."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-semibold text-ink">
            Resume Matcher
          </h1>
          <p className="font-mono text-xs text-slate mt-1">
            sign in to continue
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate/20 rounded-lg p-6"
        >
          {error && (
            <div className="mb-4 text-sm font-mono text-coral bg-coral/10 border border-coral/30 rounded px-3 py-2">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block font-mono text-xs text-slate mb-1">
              email or username
            </label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-slate/30 rounded px-3 py-2 text-sm focus:outline-none focus:border-signal"
            />
          </div>

          <div className="mb-6">
            <label className="block font-mono text-xs text-slate mb-1">
              password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-slate/30 rounded px-3 py-2 text-sm focus:outline-none focus:border-signal"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-ink text-white rounded py-2 text-sm font-medium hover:bg-signal transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-slate mt-4">
          No account?{" "}
          <Link to="/register" className="text-signal font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;