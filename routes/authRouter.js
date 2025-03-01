import express from "express";
import controllerWrapper from "../helpers/controllerWrapper.js";
import validateBody from "../helpers/validateBody.js";
import {
  signup,
  signin,
  signout,
  updateUserSubscription,
  getCurrent,
} from "../controllers/authController.js";
import {
  signupSchema,
  signinSchema,
  updateSubscriptionSchema,
} from "../schemas/authSchema.js";
import authenticate from "../middlewares/authenticate.js";

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

authRouter.get("/current", authenticate, controllerWrapper(getCurrent));

authRouter.patch(
  "/subscription",
  authenticate,
  validateBody(updateSubscriptionSchema),
  controllerWrapper(updateUserSubscription)
);

authRouter.post("/logout", authenticate, controllerWrapper(signout));

export default authRouter;
