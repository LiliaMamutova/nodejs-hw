import {Joi, Segments} from "celebrate";
import {TAGS} from "../constants/tags.js";
import {isValidObjectId} from "mongoose";

// custom validator for ObjectId
const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message("Invalid id format") : value;
};


export const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).required(),
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
    title: Joi.string().min(1).required(),
    content: Joi.string().allow("").optional(),
    tag: Joi.string().valid(...TAGS).optional(),
  }).min(1),
};


// Для маршруту PATCH /notes/:noteId потрібно валідувати параметр запиту noteId
// (валідуємо як рядок із кастомною валідацію через isValidObjectId із mongoose)
// та тіло запиту як об’єкт із наступними властивостями:
//
//   title - рядок, мінімум 1 символ, необов’язкове поле
// content - рядок, може бути порожнім рядком, необов’язкове поле
// tag - одне із значень із файла src/contacts/tags.js, необов’язкове поле
//
//
// Додайте перевірку, що хоча б одне з полів `title`, `content` або `tag` буде присутнім, тобто тіло запиту не має бути порожнім.
// Для цього створіть схему валідації updateNoteSchema (не змінюйте назву) у файлі src/validations/notesValidation.js та використайте noteIdSchema.

