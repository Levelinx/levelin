import { Router } from "express";
import { getProfile, getProfileById, getRandomProfiles, updateProfile, getUploadUrl, searchProfiles } from "../controllers/profile";
import { auth } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { getProfileSchema, updateProfileSchema, getUploadUrlSchema, searchProfilesSchema } from "../validations/profile";

const router = Router();

router.get("/search", validate(searchProfilesSchema), searchProfiles);
router.get("/random", getRandomProfiles);
router.get("/me", auth, getProfile);
router.get("/:id", validate(getProfileSchema), getProfileById);
router.put("/", auth, validate(updateProfileSchema), updateProfile);
router.post("/upload-url", auth, validate(getUploadUrlSchema), getUploadUrl);

export default router; 