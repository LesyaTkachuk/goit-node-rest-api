import Joi from "joi";
import { EMAIL_REGEX } from "../constants/auth.js";

export const signupSchema = Joi.object({
  email: Joi.string()
    .pattern(EMAIL_REGEX)
    .message("Email is not valid")
    .required(),
  password: Joi.string().min(6).required(),
  subscription: Joi.string()
    .valid("starter", "pro", "business")
    .default("starter"),
});

export const verifySchema = Joi.object({
  email: Joi.string()
    .pattern(EMAIL_REGEX)
    .message("Email is not valid")
    .required(),
});

export const signinSchema = Joi.object({
  email: Joi.string()
    .pattern(EMAIL_REGEX)
    .message("Email is not valid")
    .required(),
  password: Joi.string().min(6).required(),
});

export const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});
