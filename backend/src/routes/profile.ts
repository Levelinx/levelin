import { Router } from "express";
import { getProfile, getRandomProfiles, updateProfile, getUploadUrl } from "../controllers/profile";
import { auth } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { getProfileSchema, updateProfileSchema, getUploadUrlSchema } from "../validations/profile";

const router = Router();

router.get("/random", getRandomProfiles);
router.get("/:id", validate(getProfileSchema), getProfile);
router.put("/", auth, validate(updateProfileSchema), updateProfile);
router.post("/upload-url", auth, validate(getUploadUrlSchema), getUploadUrl);

export default router; 