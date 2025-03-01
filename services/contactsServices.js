import Contact from "../db/models/Contact.js";
import { DEFAULT_PAGE, DEFAULT_LIMIT } from "../constants/contacts.js";

export const listContacts = async (query) => {
  const {
    page: queryPage = DEFAULT_PAGE,
    limit: queryLimit = DEFAULT_LIMIT,
    ...restQuery
  } = query;

  // check for numeric values
  const page = Math.max(Number(queryPage), 1);
  const limit = Math.max(Number(queryLimit), 1);

  return await Contact.findAll({
    where: restQuery,
    limit,
    offset: (page - 1) * limit,
  });
};

export const getContactById = (contactId) => Contact.findByPk(contactId);

export const getContact = (query) => Contact.findOne({ where: query });

export const removeContact = (query) => Contact.destroy({ where: query });

export const addContact = (data) => Contact.create(data);

export const updateContact = async (query, data) => {
  const contact = await getContact(query);
  if (!contact) {
    return null;
  }

  return await contact.update(data, {
    returning: true,
  });
};

export const updateContactStatus = async (query, isFavorite) => {
  const contact = await getContact(query);
  if (!contact) {
    return null;
  }
  return contact.update({ favorite: isFavorite }, { returning: true });
};
