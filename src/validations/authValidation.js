import {Joi, Segments} from "celebrate";
import {emailRegex} from "../models/user.js";

export const registerUserSchema = {
  [Segments.BODY]: Joi.object({
    username: Joi.string().min(2),
    email: Joi.string().pattern(emailRegex).required(),
    password: Joi.string().min(8).required(),
  }),
};

export const loginUserSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().pattern(emailRegex).required(),
    password: Joi.string().required(),
  }),
};
