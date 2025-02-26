import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import HttpError from "../helpers/HttpError.js";

const { JWT_SECRET } = process.env;

export const signup = async ({ email, password, subscription }) => {
  const user = await User.findOne({ where: { email } });
  if (user) {
    throw HttpError(409, `Email ${email} is already in use`);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email,
    password: hashedPassword,
    subscription,
  });

  return {
    id: newUser.id,
    email: newUser.email,
    subscription: newUser.subscription,
  };
};

export const signin = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user.id,
    email: user.email,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });

  await User.update({ token }, { where: { id: user.id } });
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      subscription: user.subscription,
    },
  };
};
