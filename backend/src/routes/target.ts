import { Router } from "express";
import { 
    createTarget, 
    getTargets, 
    getTargetById,
    submitTarget, 
    reviewSubmission,
    getUserTargets,
    getUserSubmissions
} from "../controllers/target";
import { auth } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { 
    createTargetSchema, 
    getTargetsSchema, 
    submitTargetSchema, 
    reviewSubmissionSchema 
} from "../validations/target";

const router = Router();

router.post("/", auth, validate(createTargetSchema), createTarget);
router.get("/", validate(getTargetsSchema), getTargets);
router.get("/my-targets", auth, getUserTargets);
router.get("/my-submissions", auth, getUserSubmissions);
router.get("/:id", getTargetById);
router.post("/:target_id/submit", auth, validate(submitTargetSchema), submitTarget);
router.post("/submissions/:submission_id/review", auth, validate(reviewSubmissionSchema), reviewSubmission);

export default router; 