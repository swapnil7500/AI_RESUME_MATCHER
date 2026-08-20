import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

// Allow requests from the frontend, and allow cookies to be sent cross-origin
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// Parse incoming JSON bodies (limit prevents huge payload attacks)
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Serve static files (not heavily used here, but standard practice)
app.use(express.static("public"));

// Read JWT tokens stored in cookies
app.use(cookieParser());

// ----- routes import -----
import userRouter from "./routes/user.routes.js";
import resumeRouter from "./routes/resume.routes.js";
import matchRouter from "./routes/match.routes.js";

// ----- routes declaration -----
app.use("/api/v1/users", userRouter);
app.use("/api/v1/resumes", resumeRouter);
app.use("/api/v1/match", matchRouter);

app.use(errorHandler);
export { app };
