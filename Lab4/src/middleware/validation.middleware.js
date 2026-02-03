import { Types } from "mongoose";

export const objectId = (value, helpers) => {
  if (!Types.ObjectId.isValid(value)) {
    return helpers.error("ID invalid");
  }
  return value;
};
export const validation = (schema) => {
  return (req, res, next) => {
    const data = { ...req.body, ...req.params, ...req.query };
    const { error } = schema.validate(data, {
      abortEarly: false,
    });
    if (error) {
      const errorDetails = error.details.map((detail) => {
        return detail.message;
      });
      return next({
        status: 400,
        message: errorDetails,
      });
    }
    return next();
  };
};
