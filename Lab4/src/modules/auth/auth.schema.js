import joi from "joi";

export const regSchema = joi.object({
  email: joi.string().email().required(),
  password: joi
    .string()
    .min(8)
    .max(20)
    .pattern(/^[a-zA-Z0-9!@#$%^&*()_+={}\[\]:;"'<>,.?~`-]+$/)
    .required(),
  confirmPassword: joi
    .string()
    .valid(joi.ref("password"))
    .required()
    .messages({ "any.only": "Password and confirm password do not match" }),
});

export const logSchema = joi.object({
  email: joi.string().email().required(),
  password: joi
    .string()
    .min(8)
    .max(20)
    .pattern(/^[a-zA-Z0-9!@#$%^&*()_+={}\[\]:;"'<>,.?~`-]+$/)
    .required(),
});

export const resetSchema = joi.object({
  email: joi.string().email().required(),
});

export const newPasswordSchema = joi.object({
  email: joi.string().email().required(),
  resetCode: joi.string().length(6).required(),
  password: joi
    .string()
    .min(8)
    .max(20)
    .pattern(/^[a-zA-Z0-9!@#$%^&*()_+={}\[\]:;"'<>,.?~`-]+$/)
    .required(),
  confirmPassword: joi
    .string()
    .valid(joi.ref("password"))
    .required()
    .messages({ "any.only": "Password and confirm password do not match" }),
});
