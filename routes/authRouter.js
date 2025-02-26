import express from "express";
import controllerWrapper from "../helpers/controllerWrapper.js";
import validateBody from "../helpers/validateBody.js";
import { signup, signin } from "../controllers/authController.js";
import { signupSchema, signinSchema } from "../schemas/authSchema.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(signupSchema),
  controllerWrapper(signup)
);
authRouter.post(
  "/login",
  validateBody(signinSchema),
  controllerWrapper(signin)
);

export default authRouter;
