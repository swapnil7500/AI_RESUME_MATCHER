import api from "./axios";

export const runMatch = (resumeId, jobDescription) =>
  api.post("/match", { resumeId, jobDescription });

export const getUserMatches = () => api.get("/match");

export const getMatchById = (matchId) => api.get(`/match/${matchId}`);