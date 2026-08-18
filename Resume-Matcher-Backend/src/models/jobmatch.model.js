import mongoose, { Schema } from "mongoose";

const jobMatchSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resume: {
      type: Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    matchScore: {
      type: Number, // 0 to 100
      required: true,
    },
    missingKeywords: {
      type: [String], // array of strings
      default: [],
    },
    suggestions: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const JobMatch = mongoose.model("JobMatch", jobMatchSchema);