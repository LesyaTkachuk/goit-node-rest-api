import HttpError from "../helpers/HttpError.js";
import { verifyToken } from "../helpers/jwt.js";
import { findUser } from "../services/authService.js";
import {
  MISSING_AUTHORIZATION_HEADER,
  MISSING_BEARER,
  USER_NOT_FOUND,
} from "../constants/errorMessages.js";
("../constants/errorMessages.js");

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(HttpError(401, MISSING_AUTHORIZATION_HEADER));
  }

  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    return next(HttpError(401, MISSING_BEARER));
  }

  const { payload, error } = verifyToken(token);
  if (error) {
    return next(HttpError(401, error.message));
  }

  const user = await findUser({ id: payload.id });
  if (!user) {
    return next(HttpError(401, USER_NOT_FOUND));
  }
  req.user = user;
  next();
};

export default authenticate;
