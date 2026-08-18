import fs from "fs";
import pdfParse from "pdf-parse";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Resume } from "../models/resume.model.js";

const uploadResume = asyncHandler(async (req, res) => {
  const resumeLocalPath = req.file?.path;

  if (!resumeLocalPath) {
    throw new ApiError(400, "Resume file is required");
  }

  try {
    // Read the uploaded PDF from disk as raw bytes
    const dataBuffer = fs.readFileSync(resumeLocalPath);

    // Extract plain text out of the PDF
    const pdfData = await pdfParse(dataBuffer);
    const extractedText = pdfData.text;

    if (!extractedText || extractedText.trim() === "") {
      fs.unlinkSync(resumeLocalPath);
      throw new ApiError(
        400,
        "Could not extract text from this PDF - it may be scanned/image-based"
      );
    }

    const resume = await Resume.create({
      owner: req.user._id,
      fileName: req.file.originalname,
      extractedText,
    });

    // Delete the temp file from disk now that text is saved in MongoDB
    fs.unlinkSync(resumeLocalPath);

    return res
      .status(201)
      .json(new ApiResponse(201, resume, "Resume uploaded and parsed successfully"));
  } catch (error) {
    // Clean up the temp file even if something failed
    if (fs.existsSync(resumeLocalPath)) {
      fs.unlinkSync(resumeLocalPath);
    }
    throw new ApiError(500, error?.message || "Error processing resume");
  }
});

const getUserResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ owner: req.user._id })
    .select("-extractedText") // don't send full text in the list view, it's long
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, resumes, "Resumes fetched successfully"));
});

const getResumeById = asyncHandler(async (req, res) => {
  const { resumeId } = req.params;

  const resume = await Resume.findOne({
    _id: resumeId,
    owner: req.user._id,
  });

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, resume, "Resume fetched successfully"));
});

export { uploadResume, getUserResumes, getResumeById };