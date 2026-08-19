import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Resume } from "../models/resume.model.js";
import { JobMatch } from "../models/jobmatch.model.js";
import { analyzeMatch } from "../utils/aiMatcher.js";

const runMatch = asyncHandler(async (req, res) => {
  const { resumeId, jobDescription } = req.body;

  if (!resumeId || !jobDescription || jobDescription.trim() === "") {
    throw new ApiError(400, "Resume ID and job description are required");
  }

  const resume = await Resume.findOne({
    _id: resumeId,
    owner: req.user._id,
  });

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  const aiResult = await analyzeMatch(resume.extractedText, jobDescription);

  if (
    typeof aiResult.matchScore !== "number" ||
    aiResult.matchScore < 0 ||
    aiResult.matchScore > 100
  ) {
    throw new ApiError(500, "AI returned an invalid match score");
  }

  const jobMatch = await JobMatch.create({
    owner: req.user._id,
    resume: resume._id,
    jobDescription,
    matchScore: aiResult.matchScore,
    missingKeywords: aiResult.missingKeywords,
    suggestions: aiResult.suggestions,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, jobMatch, "Match analysis completed"));
});

const getUserMatches = asyncHandler(async (req, res) => {
  const matches = await JobMatch.find({ owner: req.user._id })
    .populate("resume", "fileName")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, matches, "Match history fetched successfully"));
});

const getMatchById = asyncHandler(async (req, res) => {
  const { matchId } = req.params;

  const match = await JobMatch.findOne({
    _id: matchId,
    owner: req.user._id,
  }).populate("resume", "fileName");

  if (!match) {
    throw new ApiError(404, "Match not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, match, "Match fetched successfully"));
});

export { runMatch, getUserMatches, getMatchById };