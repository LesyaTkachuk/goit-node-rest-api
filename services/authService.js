import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import User from "../db/models/User.js";
import HttpError from "../helpers/HttpError.js";
import { createToken } from "../helpers/jwt.js";
import { sendEmail } from "../helpers/sendEmail.js";
import {
  INVALID_CREDENTIALS,
  USER_NOT_FOUND_OR_VERIFIED,
  USER_NOT_VERIFIED,
  getUserExistMessage,
  USER_NOT_FOUND,
  USER_VERIFIED,
} from "../constants/errorMessages.js";

const { BASE_URL } = process.env;

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

const createVerifyEmail = (email, verificationToken) => {
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<p>In order to verify your email, please click the link below.</p><a href="${BASE_URL}api/auth/verify/${verificationToken}" target="_blank" rel="noopener noreferrer">Verify email</a>`,
  };

  return verifyEmail;
};

export const signup = async ({ email, password, subscription, avatarUrl }) => {
  const user = await User.findOne({ where: { email } });
  if (user) {
    throw HttpError(409, getUserExistMessage(email));
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();

  const newUser = await User.create({
    email,
    password: hashedPassword,
    subscription,
    avatarUrl,
  });

  const verifyEmail = createVerifyEmail(email, verificationToken);
  await sendEmail(verifyEmail);

  await newUser.update({ verificationToken }, { returning: true });

  return {
    id: newUser.id,
    email: newUser.email,
    subscription: newUser.subscription,
    avatarUrl: newUser.avatarUrl,
  };
};

export const verifyUser = async (verificationToken) => {
  const user = await User.findOne({ where: { verificationToken } });

  if (!user) {
    throw HttpError(404, USER_NOT_FOUND_OR_VERIFIED);
  }

  await user.update(
    { verified: true, verificationToken: null },
    { returning: true }
  );
};

export const resendVerifyEmail = async (email) => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw HttpError(404, USER_NOT_FOUND);
  }

  if (user.verified) {
    throw HttpError(400, USER_VERIFIED);
  }

  const verifyEmail = createVerifyEmail(email, user.verificationToken);

  await sendEmail(verifyEmail);
};

export const signin = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw HttpError(401, INVALID_CREDENTIALS);
  }

  if (!user.verified) {
    throw HttpError(401, USER_NOT_VERIFIED);
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
