import Contact from "../models/Contact.js";

export const listContacts = () => Contact.findAll();

export const getContactById = (contactId) => Contact.findByPk(contactId);

export const removeContact = (contactId) =>
  Contact.destroy({ where: { id: contactId } });

export const addContact = (data) => Contact.create(data);

export const updateContact = async (contactId, data) => {
  const contact = await getContactById(contactId);
  if (!contact) {
    return null;
  }
  return contact.update(data, {
    returning: true,
  });
};

export const updateContactStatus = async (contactId, isFavorite) => {
  const contact = await getContactById(contactId);
  if (!contact) {
    return null;
  }
  return contact.update({ favorite: isFavorite }, { returning: true });
};
