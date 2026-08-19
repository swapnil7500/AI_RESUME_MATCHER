import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getMatchById } from "../api/match.api";

const MatchResult = () => {
  const { matchId } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const response = await getMatchById(matchId);
        setMatch(response.data.data);
      } catch (err) {
        setError("Could not load this match result");
      } finally {
        setLoading(false);
      }
    };
    fetchMatch();
  }, [matchId]);

  const getScoreColor = (score) => {
    if (score >= 75) return "#1FAE7A"; // mint
    if (score >= 50) return "#2F6FED"; // signal
    return "#F0553D"; // coral
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mono text-sm text-slate">
        Loading result...
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-mono text-sm text-coral">{error}</p>
      </div>
    );
  }

  const scoreColor = getScoreColor(match.matchScore);
  // Circumference math for the circular gauge (radius 70)
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (match.matchScore / 100) * circumference;

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

      <div className="max-w-lg mx-auto px-4 py-10">
        <p className="font-mono text-xs text-slate mb-1">
          {match.resume?.fileName || "Resume"} ·{" "}
          {new Date(match.createdAt).toLocaleDateString()}
        </p>
        <h1 className="font-display text-xl font-semibold text-ink mb-8">
          Match Report
        </h1>

        {/* Gauge */}
        <div className="flex justify-center mb-8">
          <svg width="180" height="180" viewBox="0 0 180 180">
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="12"
            />
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke={scoreColor}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 90 90)"
            />
            <text
              x="90"
              y="85"
              textAnchor="middle"
              className="font-mono"
              fontSize="36"
              fontWeight="600"
              fill="#14181F"
            >
              {match.matchScore}
            </text>
            <text
              x="90"
              y="108"
              textAnchor="middle"
              className="font-mono"
              fontSize="11"
              fill="#6B7280"
            >
              MATCH SCORE
            </text>
          </svg>
        </div>

        {/* Missing keywords */}
        <section className="mb-6">
          <h2 className="font-display font-semibold text-ink mb-2 text-sm">
            Missing Keywords
          </h2>
          {match.missingKeywords && match.missingKeywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {match.missingKeywords.map((keyword, idx) => (
                <span
                  key={idx}
                  className="font-mono text-xs bg-coral/10 text-coral border border-coral/30 rounded px-2 py-1"
                >
                  {keyword}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate">
              No major keyword gaps found.
            </p>
          )}
        </section>

        {/* Suggestions */}
        <section className="bg-white border border-slate/20 rounded-lg p-5">
          <h2 className="font-display font-semibold text-ink mb-2 text-sm">
            Suggestions
          </h2>
          <p className="text-sm text-ink leading-relaxed">
            {match.suggestions}
          </p>
        </section>
      </div>
    </div>
  );
};

export default MatchResult;