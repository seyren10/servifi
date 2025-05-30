import { Router } from "express";
import { getAuthUser, signIn, signUp } from "../controllers/auth.controller";
import { authorize } from "../middleware/auth";
import { ClientRole } from "../enums/roles";

const authRouter = Router();
authRouter.get("/me", authorize(ClientRole.USER), getAuthUser);
authRouter.post("/signup", signUp);
authRouter.post("/signin", signIn);

export default authRouter;
