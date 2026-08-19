import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { uploadResume } from "../api/resume.api";

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type !== "application/pdf") {
      setError("Only PDF files are accepted");
      setFile(null);
      return;
    }
    setError("");
    setFile(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!file) {
      setError("Please select a PDF file first");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    setIsUploading(true);
    try {
      await uploadResume(formData);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      <nav className="border-b border-slate/20 bg-white px-6 py-4">
        <Link
          to="/"
          className="font-display text-lg font-semibold text-ink"
        >
          Resume Matcher
        </Link>
      </nav>

      <div className="max-w-md mx-auto px-4 py-12">
        <h1 className="font-display text-xl font-semibold text-ink mb-1">
          Upload Resume
        </h1>
        <p className="text-sm text-slate mb-6">
          PDF only, max 5MB. We'll extract the text automatically.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate/20 rounded-lg p-6"
        >
          {error && (
            <div className="mb-4 text-sm font-mono text-coral bg-coral/10 border border-coral/30 rounded px-3 py-2">
              {error}
            </div>
          )}

          <label className="block border-2 border-dashed border-slate/30 rounded-lg px-4 py-10 text-center cursor-pointer hover:border-signal transition-colors mb-4">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            {file ? (
              <span className="font-mono text-sm text-ink">{file.name}</span>
            ) : (
              <span className="font-mono text-sm text-slate">
                Click to choose a PDF
              </span>
            )}
          </label>

          <button
            type="submit"
            disabled={isUploading || !file}
            className="w-full bg-ink text-white rounded py-2 text-sm font-medium hover:bg-signal transition-colors disabled:opacity-50"
          >
            {isUploading ? "Uploading & parsing..." : "Upload Resume"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadResume;