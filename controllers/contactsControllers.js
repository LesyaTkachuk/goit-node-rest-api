import * as contactsService from "../services/contactsServices.js";

import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res) => {
  const contacts = await contactsService.listContacts();
  res.json(contacts);
};

export const getOneContact = async (req, res) => {
  const contactId = req.params.id;
  const contact = await contactsService.getContactById(contactId);

  if (!contact) {
    throw HttpError(404, `Contact with id=${contactId} not found`);
  }
  res.json(contact);
};

export const deleteContact = async (req, res) => {
  const contactId = req.params.id;
  const contact = await contactsService.removeContact(contactId);
  if (!contact) {
    throw HttpError(404, `Contact with id=${contactId} not found`);
  }
  res.json(contact);
};

export const createContact = async (req, res) => {
  const contact = await contactsService.addContact(req.body);
  res.status(201).json(contact);
};

export const updateContact = async (req, res) => {
  const contactId = req.params.id;

  const contact = await contactsService.updateContact(contactId, req.body);
  if (!contact) {
    throw HttpError(404, `Contact with id=${contactId} not found`);
  }
  res.json(contact);
};
