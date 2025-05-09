import { Router } from "express";
import { handleNewUser, handleMe } from "../controllers/auth";
import { auth } from "../middlewares/auth";

const authRouter = Router();

authRouter.post("/signup", auth, handleNewUser);
authRouter.get("/me", auth, handleMe);

export default authRouter;