import OpenAI from "openai";
import { AI_MODEL } from "../config/constants.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const analyzeMatch = async (resumeText, jobDescription) => {
  const prompt = `You are an expert technical recruiter and resume reviewer.

Compare the RESUME below against the JOB DESCRIPTION below.

Return ONLY a valid JSON object with this exact shape, no markdown formatting, no backticks, no extra text:
{
  "matchScore": <number between 0 and 100>,
  "missingKeywords": [<array of important skills/keywords from the job description that are missing or weak in the resume>],
  "suggestions": "<2-3 sentence actionable advice on how to improve the resume for this specific job>"
}

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}`;

  const completion = await openai.chat.completions.create({
    model: AI_MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  const rawResponse = completion.choices[0].message.content;

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