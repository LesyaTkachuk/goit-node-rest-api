import * as contactsService from "../services/contactsServices.js";

import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res) => {
  const owner = req.user.id;
  const contacts = await contactsService.listContacts({ owner });
  res.json(contacts);
};

export const getContactById = async (req, res) => {
  const owner = req.user.id;
  const { id } = req.params;
  const contact = await contactsService.getContact({ id, owner });

  if (!contact) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }
  res.json(contact);
};

export const deleteContactById = async (req, res) => {
  const owner = req.user.id;
  const { id } = req.params;
  const contact = await contactsService.removeContact({ id, owner });
  if (!contact) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }

  res.json({ message: "Contact deleted" });
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
    throw HttpError(404, `Contact with id=${id} not found`);
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
    throw HttpError(404, `Contact with id=${id} not found`);
  }
  res.json(contact);
};
