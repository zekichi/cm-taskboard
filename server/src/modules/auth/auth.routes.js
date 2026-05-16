import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/async-handler.js";
import { validateBody } from "../../middleware/validate.js";
import { loginController, meController } from "./auth.controller.js";
import { loginSchema } from "./auth.schemas.js";

const authRouter = Router();

authRouter.post("/login", validateBody(loginSchema), asyncHandler(loginController));
authRouter.get("/me", asyncHandler(authMiddleware), asyncHandler(meController));

export default authRouter;
