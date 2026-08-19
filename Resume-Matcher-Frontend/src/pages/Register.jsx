import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth.api";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await registerUser(formData);
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Try again."
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
            create your account
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

          {[
            { label: "full name", name: "fullName", type: "text" },
            { label: "username", name: "username", type: "text" },
            { label: "email", name: "email", type: "email" },
            { label: "password", name: "password", type: "password" },
          ].map((field) => (
            <div className="mb-4" key={field.name}>
              <label className="block font-mono text-xs text-slate mb-1">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required
                className="w-full border border-slate/30 rounded px-3 py-2 text-sm focus:outline-none focus:border-signal"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-ink text-white rounded py-2 text-sm font-medium hover:bg-signal transition-colors disabled:opacity-50 mt-2"
          >
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-slate mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-signal font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register; 