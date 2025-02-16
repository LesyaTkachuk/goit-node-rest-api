import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const contactsPath = path.join(process.cwd(), "db", "contacts.json");

export async function listContacts() {
  const data = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(data);
}

export async function getContactById(contactId) {
  const contacts = await listContacts();
  const contact = contacts.find((contact) => contact.id === contactId);
  return contact || null;
}

export async function removeContact(contactId) {
  const contact = await getContactById(contactId);
  if (!contact) {
    return null;
  }

  const contacts = await listContacts();
  const filteredContacts = contacts.filter(
    (contact) => contact.id !== contactId
  );
  await fs.writeFile(contactsPath, JSON.stringify(filteredContacts));
  return contact;
}

export async function addContact(data) {
  const id = nanoid();
  const newContact = {
    id,
    ...data,
  };

  const contacts = await listContacts();
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts));
  return getContactById(id);
}

export async function updateContact(contactId, data) {
  const contact = await getContactById(contactId);
  if (!contact) {
    return null;
  }

  const contacts = await listContacts();
  const updatedContacts = contacts.map((contact) =>
    contact.id === contactId ? { ...contact, ...data } : contact
  );

  await fs.writeFile(contactsPath, JSON.stringify(updatedContacts));
  return getContactById(contactId);
}
