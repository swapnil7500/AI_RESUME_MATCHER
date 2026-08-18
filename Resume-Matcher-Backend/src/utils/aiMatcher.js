import { GoogleGenerativeAI } from "@google/generative-ai";
import { AI_MODEL } from "../config/constants.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeMatch = async (resumeText, jobDescription) => {
  const model = genAI.getGenerativeModel({
    model: AI_MODEL,
    generationConfig: {
      temperature: 0.3,
      responseMimeType: "application/json",
    },
  });

  const prompt = `You are an expert technical recruiter and resume reviewer.

Compare the RESUME below against the JOB DESCRIPTION below.

Return ONLY a valid JSON object with this exact shape:
{
  "matchScore": <number between 0 and 100>,
  "missingKeywords": [<array of important skills/keywords from the job description that are missing or weak in the resume>],
  "suggestions": "<2-3 sentence actionable advice on how to improve the resume for this specific job>"
}

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}`;

  const result = await model.generateContent(prompt);
  const rawResponse = result.response.text();

  let parsed;
  try {
    parsed = JSON.parse(rawResponse);
  } catch (error) {
    throw new Error("AI returned an invalid response format");
  }

  return {
    matchScore: parsed.matchScore,
    missingKeywords: parsed.missingKeywords || [],
    suggestions: parsed.suggestions,
  };
};

export { analyzeMatch };