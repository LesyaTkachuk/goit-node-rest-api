import bcrypt from "bcrypt";
import User from "../db/models/User.js";
import HttpError from "../helpers/HttpError.js";
import { createToken } from "../helpers/jwt.js";
import { INVALID_CREDENTIALS } from "../constants/errorMessages.js";
import {
  getUserExistMessage,
  USER_NOT_FOUND,
} from "../constants/errorMessages.js";

export const findUser = async (query) => await User.findOne({ where: query });

export const updateUser = async (query, data) => {
  const user = await findUser(query);
  if (!user) {
    return next(HttpError(401, USER_NOT_FOUND));
  }
  return await user.update(data, {
    returning: true,
  });
};

export const signup = async ({ email, password, subscription, avatarUrl }) => {
  const user = await User.findOne({ where: { email } });
  if (user) {
    throw HttpError(409, getUserExistMessage(email));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email,
    password: hashedPassword,
    subscription,
    avatarUrl,
  });

  return {
    id: newUser.id,
    email: newUser.email,
    subscription: newUser.subscription,
    avatarUrl: newUser.avatarUrl,
  };
};

export const signin = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw HttpError(401, INVALID_CREDENTIALS);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw HttpError(401, INVALID_CREDENTIALS);
  }

  const payload = {
    id: user.id,
    email: user.email,
  };

  const token = createToken(payload);

  await user.update({ token }, { returning: true });
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      subscription: user.subscription,
    },
  };
};

export const logout = async (query) => await updateUser(query, { token: null });
