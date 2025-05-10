import { Router } from "express";
import { createDomain, getDomains, getDomain } from "../controllers/domain";
import { auth } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { createDomainSchema, getDomainSchema } from "../validations/domain";

const router = Router();

router.post("/", auth, validate(createDomainSchema), createDomain);
router.get("/", auth, getDomains);
router.get("/:id", auth, validate(getDomainSchema), getDomain);

export default router;