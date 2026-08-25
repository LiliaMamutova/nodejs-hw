import {Joi, Segments} from "celebrate";
import {TAGS} from "../constants/tags.js";
import {isValidObjectId} from "mongoose";

// custom validator for ObjectId
const objectIdValidator = (value, helpers) => {
  return isValidObjectId(value) ? value : helpers.message("Invalid id format");
};


export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
    tag: Joi.string().valid(...TAGS).insensitive().optional(),
    search: Joi.string().trim().allow("").insensitive(),
  }),
};

export const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).trim().required(),
    content: Joi.string().allow("").optional(),
    tag: Joi.string().valid(...TAGS).optional(),
  }),
};

export const noteIdSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),
};

export const updateNoteSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).trim().optional(),
    content: Joi.string().trim().allow("").optional(),
    tag: Joi.string().valid(...TAGS).optional(),
  }).min(1),
};
