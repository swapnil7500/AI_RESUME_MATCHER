import api from "./axios";

export const uploadResume = (formData) =>
  api.post("/resumes/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getUserResumes = () => api.get("/resumes");

export const getResumeById = (resumeId) => api.get(`/resumes/${resumeId}`);