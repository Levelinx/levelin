import { Router } from "express";
import { createDomain } from "../controllers/domain";

const domainRouter = Router();

domainRouter.post("/new", createDomain);

export default domainRouter;