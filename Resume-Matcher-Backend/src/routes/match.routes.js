import { Router } from "express";
import {
  runMatch,
  getUserMatches,
  getMatchById,
} from "../controllers/match.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(runMatch).get(getUserMatches);
router.route("/:matchId").get(getMatchById);

export default router;