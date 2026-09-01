import {Router} from "express";
import {createNote, deleteNote, getAllNotes, getNoteById, updateNote} from "../controllers/notesController.js";
import {celebrate} from "celebrate";
import {
  createNoteSchema,
  getAllNotesSchema,
  noteIdSchema,
  updateNoteSchema,
} from "../validations/notesValidation.js";
import {authenticate} from "../middleware/authenticate.js";

const noteRouter = Router();

noteRouter.use("/notes", authenticate);

noteRouter.get("/notes",
  celebrate(getAllNotesSchema,
    {abortEarly: false}),
  getAllNotes);

noteRouter.get("/notes/:noteId",
  celebrate(noteIdSchema,
    {abortEarly: false}),
  getNoteById);

noteRouter.post("/notes",
  celebrate(createNoteSchema,
    {abortEarly: false}),
  createNote);

noteRouter.delete("/notes/:noteId",
  celebrate(noteIdSchema,
{ abortEarly: false }),
  deleteNote);

noteRouter.patch("/notes/:noteId",
  celebrate(updateNoteSchema,
    {abortEarly: false}),
  updateNote);

export default noteRouter;
