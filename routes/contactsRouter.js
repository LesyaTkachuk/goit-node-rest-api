import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateContactStatus,
} from "../controllers/contactsControllers.js";
import controllerWrapper from "../helpers/controllerWrapper.js";
import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
  updateContactStatusSchema,
} from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();

contactsRouter.get("/", controllerWrapper(getAllContacts));

contactsRouter.get("/:id", controllerWrapper(getOneContact));

contactsRouter.delete("/:id", controllerWrapper(deleteContact));

contactsRouter.post(
  "/",
  validateBody(createContactSchema),
  controllerWrapper(createContact)
);

contactsRouter.put(
  "/:id",
  validateBody(updateContactSchema),
  controllerWrapper(updateContact)
);

contactsRouter.patch(
  "/:id/favorite",
  validateBody(updateContactStatusSchema),
  controllerWrapper(updateContactStatus)
);

export default contactsRouter;
