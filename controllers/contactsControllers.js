import * as contactsService from "../services/contactsServices.js";
import { getContactNotFoundMessage } from "../constants/errorMessages.js";
import { CONTACT_DELETED } from "../constants/successMessages.js";

import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res) => {
  const queryParams = req.query;

  const owner = req.user.id;
  const contacts = await contactsService.listContacts({
    owner,
    ...(queryParams && queryParams),
  });
  res.json(contacts);
};

export const getContactById = async (req, res) => {
  const owner = req.user.id;
  const { id } = req.params;
  const contact = await contactsService.getContact({ id, owner });

  if (!contact) {
    throw HttpError(404, getContactNotFoundMessage(id));
  }
  res.json(contact);
};

export const deleteContactById = async (req, res) => {
  const owner = req.user.id;
  const { id } = req.params;
  const contact = await contactsService.removeContact({ id, owner });
  if (!contact) {
    throw HttpError(404, getContactNotFoundMessage(id));
  }

  res.json({ message: CONTACT_DELETED });
};

export const createContact = async (req, res) => {
  const owner = req.user.id;
  const contact = await contactsService.addContact({ owner, ...req.body });
  res.status(201).json(contact);
};

export const updateContactById = async (req, res) => {
  const owner = req.user.id;
  const { id } = req.params;

  const contact = await contactsService.updateContact({ owner, id }, req.body);

  if (!contact) {
    throw HttpError(404, getContactNotFoundMessage(id));
  }
  res.json(contact);
};

export const updateContactStatusById = async (req, res) => {
  const owner = req.user.id;
  const { id } = req.params;
  const isFavorite = req.body.favorite;
  const contact = await contactsService.updateContactStatus(
    { owner, id },
    isFavorite
  );
  if (!contact) {
    throw HttpError(404, getContactNotFoundMessage(id));
  }
  res.json(contact);
};
