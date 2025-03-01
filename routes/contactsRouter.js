import express from "express";
import {
  getAllContacts,
  getContactById,
  deleteContactById,
  createContact,
  updateContactById,
  updateContactStatusById,
} from "../controllers/contactsControllers.js";
import controllerWrapper from "../helpers/controllerWrapper.js";
import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
  updateContactStatusSchema,
} from "../schemas/contactsSchemas.js";
import authenticate from "../middlewares/authenticate.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", controllerWrapper(getAllContacts));

contactsRouter.get("/:id", controllerWrapper(getContactById));

contactsRouter.delete("/:id", controllerWrapper(deleteContactById));

contactsRouter.post(
  "/",
  validateBody(createContactSchema),
  controllerWrapper(createContact)
);

contactsRouter.put(
  "/:id",
  validateBody(updateContactSchema),
  controllerWrapper(updateContactById)
);

contactsRouter.patch(
  "/:id/favorite",
  validateBody(updateContactStatusSchema),
  controllerWrapper(updateContactStatusById)
);

export default contactsRouter;
