import { Router } from "express";
import {
  uploadResume,
  getUserResumes,
  getResumeById,
} from "../controllers/resume.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// every route here requires the user to be logged in
router.use(verifyJWT);

router.route("/upload").post(upload.single("resume"), uploadResume);
router.route("/").get(getUserResumes);
router.route("/:resumeId").get(getResumeById);

export default router;
