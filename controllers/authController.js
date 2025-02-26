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
