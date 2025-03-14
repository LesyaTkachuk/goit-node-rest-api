import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().max(100).required(),
  phone: Joi.string().min(7).max(14).required(),
  favorite: Joi.boolean(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  email: Joi.string().email().max(100),
  phone: Joi.string().min(7).max(14),
  favorite: Joi.boolean(),
})
  .min(1)
  .message("Body must have at least one field");

  export const updateContactStatusSchema = Joi.object({
    favorite: Joi.boolean().required(),
  });