import Contact from "../db/models/Contact.js";

export const listContacts = (query) => Contact.findAll({ where: query });

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
