import * as authService from "../services/authService.js";

export const signup = async (req, res) => {
  const user = await authService.signup(req.body);

  res.status(201).json({
    user,
  });
};

export const signin = async (req, res) => {
  const result = await authService.signin(req.body);

  res.status(200).json(result);
};

export const getCurrent = async (req, res) => {
  res.status(200).json({
    id: req.user.id,
    email: req.user.email,
    subscription: req.user.subscription,
  });
};

export const signout = async (req, res) => {
  const { id } = req.user;

  await authService.logout({ id });

  res.json({ message: "Success logout" });
};
