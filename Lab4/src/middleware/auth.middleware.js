import { User } from "../../DB/models/user.model.js";
import { Token } from "../../DB/models/token.modle.js";
import { asyncHandler } from "./../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
export const auth = asyncHandler(async (req, res, next) => {
  let { token } = req.headers;
  if (!token) {
    return next(new Error("You are not authorized to access this route"));
  }
  if (!token.startsWith(process.env.BEARER_TOKEN)) {
    return next(new Error("You are not authorized to access this route"));
  }
  token = token.split(" ")[1];
  if (!token) {
    return next(new Error("You are not authorized to access this route"));
  }
  // if (!(await Token.findOne({ token }))) {
  //   return next(new Error("Token Invalid"), { cause: 400 });
  // }
  const tokenDB = await Token.findOne({ token, isValid: true });
  if (!tokenDB) {
    return next(new Error("Token Invalid"), { cause: 400 });
  }
  if (tokenDB.expiredAt < Date.now()) {
    tokenDB.isValid = false;
    await tokenDB.save();
    return next(new Error("Token Expired"), { cause: 400 });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  req.user = user;
  req.token = token;
  next();
});
