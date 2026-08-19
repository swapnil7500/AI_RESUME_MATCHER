import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserResumes } from "../api/resume.api";
import { getUserMatches, runMatch } from "../api/match.api";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [matches, setMatches] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isMatching, setIsMatching] = useState(false);
  const [error, setError] = useState("");
  const [loadingData, setLoadingData] = useState(true);

  const loadData = async () => {
    try {
      const [resumeRes, matchRes] = await Promise.all([
        getUserResumes(),
        getUserMatches(),
      ]);
      setResumes(resumeRes.data.data);
      setMatches(matchRes.data.data);
    } catch (err) {
      setError("Failed to load your data");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRunMatch = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedResumeId || jobDescription.trim() === "") {
      setError("Select a resume and paste a job description");
      return;
    }

    setIsMatching(true);
    try {
      const response = await runMatch(selectedResumeId, jobDescription);
      const newMatch = response.data.data;
      navigate(`/match/${newMatch._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Match analysis failed");
    } finally {
      setIsMatching(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const scoreColor = (score) => {
    if (score >= 75) return "text-mint";
    if (score >= 50) return "text-signal";
    return "text-coral";
  };

  return (
    <div className="min-h-screen bg-paper">
      <nav className="border-b border-slate/20 bg-white px-6 py-4 flex items-center justify-between">
        <h1 className="font-display text-lg font-semibold text-ink">
          Resume Matcher
        </h1>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-slate">
            {user?.fullName}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-coral font-medium"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 text-sm font-mono text-coral bg-coral/10 border border-coral/30 rounded px-3 py-2">
            {error}
          </div>
        )}

        {/* Resumes section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold text-ink">
              Your Resumes
            </h2>
            <Link
              to="/upload"
              className="text-sm text-signal font-medium"
            >
              + Upload New
            </Link>
          </div>

          {loadingData ? (
            <p className="font-mono text-sm text-slate">Loading...</p>
          ) : resumes.length === 0 ? (
            <div className="bg-white border border-slate/20 rounded-lg p-6 text-center">
              <p className="text-sm text-slate mb-3">
                No resumes uploaded yet
              </p>
              <Link
                to="/upload"
                className="text-signal font-medium text-sm"
              >
                Upload your first resume
              </Link>
            </div>
          ) : (
            <div className="bg-white border border-slate/20 rounded-lg divide-y divide-slate/10">
              {resumes.map((resume) => (
                <div
                  key={resume._id}
                  className="px-4 py-3 flex items-center justify-between"
                >
                  <span className="text-sm text-ink">{resume.fileName}</span>
                  <span className="font-mono text-xs text-slate">
                    {new Date(resume.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Run new match section */}
        {resumes.length > 0 && (
          <section className="mb-8">
            <h2 className="font-display font-semibold text-ink mb-3">
              Run a Match
            </h2>
            <form
              onSubmit={handleRunMatch}
              className="bg-white border border-slate/20 rounded-lg p-5"
            >
              <div className="mb-4">
                <label className="block font-mono text-xs text-slate mb-1">
                  select resume
                </label>
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full border border-slate/30 rounded px-3 py-2 text-sm focus:outline-none focus:border-signal"
                >
                  <option value="">-- choose a resume --</option>
                  {resumes.map((resume) => (
                    <option key={resume._id} value={resume._id}>
                      {resume.fileName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block font-mono text-xs text-slate mb-1">
                  job description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={6}
                  placeholder="Paste the full job description here..."
                  className="w-full border border-slate/30 rounded px-3 py-2 text-sm focus:outline-none focus:border-signal resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isMatching}
                className="w-full bg-ink text-white rounded py-2 text-sm font-medium hover:bg-signal transition-colors disabled:opacity-50"
              >
                {isMatching ? "Analyzing..." : "Run Match Analysis"}
              </button>
            </form>
          </section>
        )}

        {/* Match history section */}
        <section>
          <h2 className="font-display font-semibold text-ink mb-3">
            Match History
          </h2>
          {matches.length === 0 ? (
            <p className="font-mono text-sm text-slate">
              No matches run yet
            </p>
          ) : (
            <div className="bg-white border border-slate/20 rounded-lg divide-y divide-slate/10">
              {matches.map((match) => (
                <Link
                  key={match._id}
                  to={`/match/${match._id}`}
                  className="px-4 py-3 flex items-center justify-between hover:bg-paper transition-colors"
                >
                  <div>
                    <p className="text-sm text-ink">
                      {match.resume?.fileName || "Resume"}
                    </p>
                    <p className="font-mono text-xs text-slate">
                      {new Date(match.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`font-mono font-semibold ${scoreColor(
                      match.matchScore
                    )}`}
                  >
                    {match.matchScore}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;