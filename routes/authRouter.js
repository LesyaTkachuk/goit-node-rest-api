import express from "express";
import controllerWrapper from "../helpers/controllerWrapper.js";
import validateBody from "../helpers/validateBody.js";
import {
  signup,
  verify,
  resendVerify,
  signin,
  signout,
  updateUserSubscription,
  updateUserAvatar,
  getCurrent,
} from "../controllers/authController.js";
import {
  signupSchema,
  verifySchema,
  signinSchema,
  updateSubscriptionSchema,
} from "../schemas/authSchema.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(signupSchema),
  controllerWrapper(signup)
);

authRouter.get("/verify/:verificationToken", controllerWrapper(verify));

authRouter.post("/verify",validateBody(verifySchema), controllerWrapper(resendVerify));

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

authRouter.patch("/avatars", authenticate, upload.single("avatar"), controllerWrapper(updateUserAvatar));

authRouter.post("/logout", authenticate, controllerWrapper(signout));

export default authRouter;
