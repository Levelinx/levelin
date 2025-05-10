import { Router } from "express";
import { createChallenge, getChallenges, submitChallenge, reviewChallenge } from "../controllers/challenge";
import { auth } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { 
    createChallengeSchema, 
    getChallengesSchema, 
    submitChallengeSchema, 
    reviewChallengeSchema 
} from "../validations/challenge";

const router = Router();

router.post("/", auth, validate(createChallengeSchema), createChallenge);
router.get("/", validate(getChallengesSchema), getChallenges);
router.post("/:challenge_id/submit", auth, validate(submitChallengeSchema), submitChallenge);
router.post("/submissions/:submission_id/review", auth, validate(reviewChallengeSchema), reviewChallenge);

export default router; 