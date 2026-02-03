import joi from "joi";

export const noteSchema = joi.object({
  title: joi.string().required(),
  content: joi.string().required(),
});
