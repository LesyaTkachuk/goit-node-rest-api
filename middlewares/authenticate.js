import HttpError from "../helpers/HttpError.js";
import { verifyToken } from "../helpers/jwt.js";
import { findUser } from "../services/authService.js";

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(HttpError(401, "Missing Authorization header"));
  }

  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    return next(HttpError(401, "Missing Bearer"));
  }

  const { payload, error } = verifyToken(token);
  if (error) {
    return next(HttpError(401, error.message));
  }

  const user = await findUser({ id: payload.id });
  if (!user) {
    return next(HttpError(401, "User not found"));
  }
  req.user = user;
  next();
};

export default authenticate;
